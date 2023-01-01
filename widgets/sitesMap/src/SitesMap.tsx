import type { FunctionComponent, RefObject } from 'react';
import type { Map as LeafletMap } from 'react-leaflet';
import type { MarkerIconColor } from '../../../app/widgets/common/map/MarkerIcon';
import type { WidgetDimensions } from '../../../app/widgets/common/map/widget-dimensions';
import SiteControl from './SiteControl';
import type { DeploymentStatusesSummary, SitesData } from './types';
import { DeploymentStatuses } from './types';

function openPopup(marker: any) {
    if (marker && marker.leafletElement) {
        window.setTimeout(() => {
            marker.leafletElement.openPopup();
        });
    }
}

function getMarkerColor(statusesSummary: DeploymentStatusesSummary) {
    let color: MarkerIconColor = 'grey';

    if (statusesSummary[DeploymentStatuses.RequiresAttention] > 0) {
        color = 'red';
    } else if (statusesSummary[DeploymentStatuses.InProgress] > 0) {
        color = 'yellow';
    } else if (statusesSummary[DeploymentStatuses.Good] > 0) {
        color = 'blue';
    }

    return color;
}

type SitesMapState = {
    isMapAvailable: boolean | null;
};
interface SitesMapProps {
    data: SitesData;
    dimensions: WidgetDimensions;
    showAllLabels: boolean;
    sitesAreDefined: boolean;
    toolbox: Stage.Types.Toolbox;
}
class SitesMap extends React.Component<SitesMapProps, SitesMapState> {
    private mapRef: RefObject<LeafletMap> = React.createRef();

    constructor(props: SitesMapProps) {
        super(props);

        this.state = {
            isMapAvailable: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        const MapsActions = Stage.Common.Map.Actions;

        return new MapsActions(toolbox).isAvailable().then(isMapAvailable => this.setState({ isMapAvailable }));
    }

    shouldComponentUpdate(nextProps: SitesMapProps, nextState: SitesMapState) {
        const { data, dimensions, showAllLabels, sitesAreDefined } = this.props;
        const { isMapAvailable } = this.state;

        return (
            !_.isEqual(data, nextProps.data) ||
            !_.isEqual(dimensions, nextProps.dimensions) ||
            !_.isEqual(showAllLabels, nextProps.showAllLabels) ||
            !_.isEqual(sitesAreDefined, nextProps.sitesAreDefined) ||
            !_.isEqual(isMapAvailable, nextState.isMapAvailable)
        );
    }

    componentDidUpdate(prevProps: SitesMapProps) {
        const { dimensions } = this.props;
        if (prevProps.dimensions !== dimensions) {
            Stage.Common.Map.invalidateSizeAfterDimensionsChange(this.mapRef);
        }
    }

    createMarkers() {
        const { data, showAllLabels, toolbox } = this.props;
        const showLabels = showAllLabels ? openPopup : undefined;
        const { createMarkerIcon } = Stage.Common.Map;
        const { Marker, Popup } = Stage.Basic.Leaflet;

        return _.map(data, (site, name) => {
            const { statusesSummary } = site;
            const color = getMarkerColor(statusesSummary);
            const icon = createMarkerIcon(color);

            return (
                <Marker
                    position={Stage.Common.Map.siteToLatLng(site)}
                    ref={showLabels}
                    key={`siteMarker${name}`}
                    riseOnHover
                    icon={icon}
                >
                    <Popup interactive autoClose={false} closeOnClick={false}>
                        <SiteControl site={{ name, statusesSummary }} toolbox={toolbox} />
                    </Popup>
                </Marker>
            );
        });
    }

    render() {
        const { Leaflet, Loading } = Stage.Basic;
        const { Map } = Leaflet;

        const { data, sitesAreDefined } = this.props;
        const { isMapAvailable } = this.state;

        if (isMapAvailable === null) {
            return <Loading />;
        }

        if (isMapAvailable === false) {
            const { NoDataMessage } = Stage.Common.Components;
            return <NoDataMessage repositoryName="maps" />;
        }

        const markers = this.createMarkers();
        if (_.isEmpty(markers)) {
            return <NoSitesDataMessage sitesAreDefined={sitesAreDefined} />;
        }

        const { DefaultTileLayer } = Stage.Common.Map;

        const sites = _.values(data);
        const { options: mapOptions, bounds } = Stage.Common.Map.getMapOptions(sites);

        return (
            <Map
                ref={this.mapRef}
                className="sites-map"
                bounds={bounds}
                center={mapOptions.center}
                zoom={mapOptions.zoom}
            >
                <DefaultTileLayer />
                {markers}
            </Map>
        );
    }
}

export default connectToStore(state => _.get(state, 'config.app.maps', () => ({})), {})(SitesMap);

interface NoSitesDataMessageProps {
    sitesAreDefined: boolean;
}
const NoSitesDataMessage: FunctionComponent<NoSitesDataMessageProps> = ({ sitesAreDefined }) => {
    const { NoDataMessage } = Stage.Common.Components;
    const { Link } = Stage.Shared;
    const REASON = sitesAreDefined ? 'the defined sites have no location' : 'no sites are defined';
    const NO_DATA_MESSAGE = `This widget shares site location and status info.
                             There is no data to display because ${REASON}. Sites can be added in the `;
    return (
        <NoDataMessage>
            <>
                {NO_DATA_MESSAGE} <Link to="/page/sites">Sites page</Link>.
            </>
        </NoDataMessage>
    );
};
