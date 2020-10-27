import DeploymentStatePropType from './props/DeploymentStatePropType';
import SiteControl from './SiteControl';

function openPopup(marker) {
    if (marker && marker.leafletElement) {
        window.setTimeout(() => {
            marker.leafletElement.openPopup();
        });
    }
}

function mapToLatLng(site) {
    return [site.latitude, site.longitude];
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
        const { attribution, data, dimensions, showAllLabels, sitesAreDefined } = this.props;
        const { isMapAvailable } = this.state;

        return (
            !_.isEqual(attribution, nextProps.attribution) ||
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
            // Widget properties change doesn't affect immediately DOM changes,
            // so it's necessary to wait a bit till DOM is updated.
            const refreshAfterDimensionChangeTimeout = 500;
            setTimeout(() => {
                const { current } = this.mapRef;
                if (current && current.leafletElement) current.leafletElement.invalidateSize();
            }, refreshAfterDimensionChangeTimeout);
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
                    position={mapToLatLng(site)}
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
        const { Map, TileLayer } = Leaflet;

        const { attribution, data, sitesAreDefined } = this.props;
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

        const { initialZoom, mapOptions, urlTemplate } = Stage.Common.Consts.leaflet;
        const url = Stage.Utils.Url.url(urlTemplate);

        const sites = _.values(data);
        if (sites.length > 1) {
            mapOptions.bounds = L.latLngBounds(sites.map(mapToLatLng)).pad(0.05);
        } else {
            mapOptions.center = mapToLatLng(sites[0]);
            mapOptions.zoom = initialZoom;
        }

        return (
            <Map
                ref={this.mapRef}
                className="sites-map"
                bounds={mapOptions.bounds}
                center={mapOptions.center}
                zoom={mapOptions.zoom}
            >
                <TileLayer attribution={attribution} url={url} />
                {markers}
            </Map>
        );
    }
}

SitesMap.propTypes = {
    attribution: PropTypes.string.isRequired,
    data: PropTypes.objectOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
            deploymentStates: DeploymentStatePropType.isRequired
        })
    ).isRequired,
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
