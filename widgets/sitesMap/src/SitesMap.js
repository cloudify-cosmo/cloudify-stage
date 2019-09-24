import SiteControl from './SiteControl';
import createMarkerIcon from '../../common/src/MarkerIcon';

export default class SitesMap extends React.Component {
    /**
     * propTypes
     *
     * @property {boolean} sitesAreDefined - specifies whether sites are defined
     * @property {boolean} isMapAvailable - specifies whether there is internet connection
     * @property {object} toolbox - Toolbox object
     * @property {object} data - object with sites data
     * @property {object} dimensions - object with widget dimensions
     * @property {string} tilesUrlTemplate - map tiles provider template URL
     * @property {string} attribution - map attribution to be added to map view
     * @property {boolean} showAllLabels - specifies whether all the site labels displayed
     */
    static propTypes = {
        sitesAreDefined: PropTypes.bool.isRequired,
        isMapAvailable: PropTypes.bool.isRequired,
        toolbox: PropTypes.object.isRequired,
        data: PropTypes.objectOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                color: PropTypes.string.isRequired,
                latitude: PropTypes.number.isRequired,
                longitude: PropTypes.number.isRequired,
                deploymentStates: PropTypes.shape({
                    pending: PropTypes.array.isRequired,
                    inProgress: PropTypes.array.isRequired,
                    good: PropTypes.array.isRequired,
                    failed: PropTypes.array.isRequired
                }).isRequired
            })
        ).isRequired,

        dimensions: PropTypes.shape({
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            maximized: PropTypes.bool
        }).isRequired,

        tilesUrlTemplate: PropTypes.string.isRequired,
        attribution: PropTypes.string.isRequired,
        showAllLabels: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        const {
            attribution,
            data,
            dimensions,
            isMapAvailable,
            showAllLabels,
            sitesAreDefined,
            tilesUrlTemplate
        } = this.props;

        return (
            !_.isEqual(attribution, nextProps.attribution) ||
            !_.isEqual(data, nextProps.data) ||
            !_.isEqual(dimensions, nextProps.dimensions) ||
            !_.isEqual(isMapAvailable, nextProps.isMapAvailable) ||
            !_.isEqual(showAllLabels, nextProps.showAllLabels) ||
            !_.isEqual(sitesAreDefined, nextProps.sitesAreDefined) ||
            !_.isEqual(tilesUrlTemplate, nextProps.tilesUrlTemplate)
        );
    }

    componentDidUpdate(prevProps) {
        const { dimensions } = this.props;
        if (prevProps.dimensions !== dimensions) {
            // Widget properties change doesn't affect immediately DOM changes,
            // so it's necessary to wait a bit till DOM is updated.
            const refreshAfterDimensionChangeTimeout = 500;
            setTimeout(() => this.mapRef.current.leafletElement.invalidateSize(), refreshAfterDimensionChangeTimeout);
        }
    }

    _openPopup(marker) {
        if (marker && marker.leafletElement) {
            window.setTimeout(() => {
                marker.leafletElement.openPopup();
            });
        }
    }

    _createMarkers() {
        const markers = [];
        const showLabels = this.props.showAllLabels ? this._openPopup : undefined;

        _.forEach(this.props.data, site => {
            const icon = createMarkerIcon(site.color);

            const { Marker, Popup } = Stage.Basic.Leaflet;
            markers.push(
                <Marker
                    position={this._mapToLatLng(site)}
                    ref={showLabels}
                    key={`siteMarker${site.name}`}
                    riseOnHover
                    icon={icon}
                >
                    <Popup interactive autoClose={false} closeOnClick={false}>
                        <SiteControl site={site} toolbox={this.props.toolbox} />
                    </Popup>
                </Marker>
            );
        });

        return markers;
    }

    _mapToLatLng(site) {
        return [site.latitude, site.longitude];
    }

    render() {
        const { Map, TileLayer } = Stage.Basic.Leaflet;
        const { attribution, isMapAvailable, sitesAreDefined, tilesUrlTemplate } = this.props;
        if (!isMapAvailable) {
            const NO_INTERNET_MESSAGE = `The widget content cannot be displayed because there is no connection 
                                         to the maps repository. Please check network connection and widget's configuration.`;
            return <MapMessage text={NO_INTERNET_MESSAGE} />;
        }

        const markers = this._createMarkers();
        if (_.isEmpty(markers)) {
            return <NoDataMessage sitesAreDefined={sitesAreDefined} />;
        }

        const mapOptions = { ...Stage.Common.Consts.leaflet.mapOptions };

        const sites = _.values(this.props.data);
        if (sites.length > 1) {
            mapOptions.bounds = L.latLngBounds(sites.map(this._mapToLatLng)).pad(0.05);
        } else {
            mapOptions.center = this._mapToLatLng(sites[0]);
            mapOptions.zoom = Stage.Common.Consts.leaflet.initialZoom;
        }

        return (
            <Map ref={this.mapRef} className="sites-map" {...mapOptions}>
                <TileLayer attribution={attribution} url={tilesUrlTemplate} />
                {markers}
            </Map>
        );
    }
}

function NoDataMessage({ sitesAreDefined }) {
    const REASON = sitesAreDefined ? 'the defined sites have no location' : 'no sites are defined';
    const NO_DATA_MESSAGE = `This widget shares site location and status info.
                             There is no data to display because ${REASON}. Sites can be added in the `;
    return <MapMessage text={NO_DATA_MESSAGE} addLink />;
}

function MapMessage({ text, addLink }) {
    const { Link, Message, MessageContainer } = Stage.Basic;
    const SITES_PAGE_PATH = '/page/site_management';

    return (
        <MessageContainer wide margin="30px auto">
            <Message>
                {text}
                {addLink && <Link to={SITES_PAGE_PATH}>Site Management page.</Link>}
            </Message>
        </MessageContainer>
    );
}
