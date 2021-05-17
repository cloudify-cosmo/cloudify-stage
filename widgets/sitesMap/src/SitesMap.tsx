import DeploymentStatePropType from './props/DeploymentStatePropType';
import SiteControl from './SiteControl';

function openPopup(marker) {
    if (marker && marker.leafletElement) {
        window.setTimeout(() => {
            marker.leafletElement.openPopup();
        });
    }
}

class SitesMap extends React.Component {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
        this.state = {
            isMapAvailable: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        const { MapsActions } = Stage.Common;

        return new MapsActions(toolbox).isAvailable().then(isMapAvailable => this.setState({ isMapAvailable }));
    }

    shouldComponentUpdate(nextProps, nextState) {
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

    componentDidUpdate(prevProps) {
        const { dimensions } = this.props;
        if (prevProps.dimensions !== dimensions) {
            Stage.Common.Map.invalidateSizeAfterDimensionsChange(this.mapRef);
        }
    }

    createMarkers() {
        const markers = [];
        const { data, showAllLabels, toolbox } = this.props;
        const showLabels = showAllLabels ? openPopup : undefined;

        _.forEach(data, site => {
            const { createMarkerIcon } = Stage.Common;
            const icon = createMarkerIcon(site.color);

            const { Marker, Popup } = Stage.Basic.Leaflet;
            markers.push(
                <Marker
                    position={Stage.Common.Map.siteToLatLng(site)}
                    ref={showLabels}
                    key={`siteMarker${site.name}`}
                    riseOnHover
                    icon={icon}
                >
                    <Popup interactive autoClose={false} closeOnClick={false}>
                        <SiteControl site={site} toolbox={toolbox} />
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

SitesMap.propTypes = {
    data: PropTypes.objectOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
            deploymentStates: DeploymentStatePropType.isRequired
        })
    ).isRequired,
    /* @see {Stage.Common.Map.WidgetDimensions} */
    dimensions: PropTypes.shape({
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        maximized: PropTypes.bool
    }).isRequired,
    showAllLabels: PropTypes.bool.isRequired,
    sitesAreDefined: PropTypes.bool.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

export default connectToStore(state => _.get(state, 'config.app.maps', () => ({})), {})(SitesMap);

function NoSitesDataMessage({ sitesAreDefined }) {
    const { NoDataMessage } = Stage.Common;
    const { Link } = Stage.Shared;
    const REASON = sitesAreDefined ? 'the defined sites have no location' : 'no sites are defined';
    const NO_DATA_MESSAGE = `This widget shares site location and status info.
                             There is no data to display because ${REASON}. Sites can be added in the `;
    return (
        <NoDataMessage>
            {NO_DATA_MESSAGE} <Link to="/page/site_management">Site Management page.</Link>
        </NoDataMessage>
    );
}

NoSitesDataMessage.propTypes = {
    sitesAreDefined: PropTypes.bool.isRequired
};
