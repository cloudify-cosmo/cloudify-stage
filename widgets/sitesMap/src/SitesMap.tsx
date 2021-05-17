import type { FunctionComponent, ReactNode, RefObject } from 'react';
import type { Map as LeafletMap } from 'react-leaflet';
import SiteControl from './SiteControl';
import type { SitesMapWidgetData } from './types';

function openPopup(marker) {
    if (marker && marker.leafletElement) {
        window.setTimeout(() => {
            marker.leafletElement.openPopup();
        });
    }
}

function getMarkerColor(deploymentStates: Record<Stage.Common.DeploymentsView.Types.DeploymentStatus, number>) {
    const { DeploymentStatus } = Stage.Common.DeploymentsView.Types;
    let color: Stage.Common.MarkerIconColor = 'grey';

    if (deploymentStates[DeploymentStatus.RequiresAttention] > 0) {
        color = 'red';
    } else if (deploymentStates[DeploymentStatus.InProgress] > 0) {
        color = 'yellow';
    } else if (deploymentStates[DeploymentStatus.Good] > 0) {
        color = 'green';
    }

    return color;
}

type SitesMapState = {
    isMapAvailable: boolean | null;
};
interface SitesMapProps {
    data: SitesMapWidgetData;
    dimensions: Stage.Common.Map.WidgetDimensions;
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
        const { MapsActions } = Stage.Common;

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
        const markers: ReactNode[] = [];
        const { data, showAllLabels, toolbox } = this.props;
        const showLabels = showAllLabels ? openPopup : undefined;

        _.forEach(data, (site, name) => {
            const { createMarkerIcon } = Stage.Common;
            const { deploymentStates } = site;
            const color = getMarkerColor(deploymentStates);
            const icon = createMarkerIcon(color);

            const { Marker, Popup } = Stage.Basic.Leaflet;
            markers.push(
                <Marker
                    position={Stage.Common.Map.siteToLatLng(site)}
                    ref={showLabels}
                    key={`siteMarker${name}`}
                    riseOnHover
                    icon={icon}
                >
                    <Popup interactive autoClose={false} closeOnClick={false}>
                        <SiteControl site={{ name, deploymentStates }} toolbox={toolbox} />
                    </Popup>
                </Marker>
            );
        });

        return markers;
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
            const { NoDataMessage } = Stage.Common;
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
    const { NoDataMessage } = Stage.Common;
    const { Link } = Stage.Shared;
    const REASON = sitesAreDefined ? 'the defined sites have no location' : 'no sites are defined';
    const NO_DATA_MESSAGE = `This widget shares site location and status info.
                             There is no data to display because ${REASON}. Sites can be added in the `;
    return (
        <NoDataMessage>
            <>
                {NO_DATA_MESSAGE} <Link to="/page/site_management">Site Management page</Link>.
            </>
        </NoDataMessage>
    );
};
