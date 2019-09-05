import SiteControl from './SiteControl';

export default class SitesMap extends React.Component {
    /**
     * propTypes
     *
     * @property {boolean} sitesAreDefined - specifies whether sites are defined
     * @property {boolean} isMapAvailable - specifies whether there is internet connection
     * @property {boolean} mapUrl - the base url of the tiles server
     * @property {boolean} showAllLabels - specifies whether all the site labels displayed
     * @property {object} toolbox - Toolbox object
     * @property {object} data - object with sites data
     * @property {object} dimensions - object with widget dimensions
     */
    static propTypes = {
        sitesAreDefined: PropTypes.bool.isRequired,
        isMapAvailable: PropTypes.bool.isRequired,
        mapUrl: PropTypes.string.isRequired,
        showAllLabels: PropTypes.bool.isRequired,
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
            maximized: PropTypes.bool.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        return (
            !_.isEqual(this.props.showAllLabels, nextProps.showAllLabels) ||
            !_.isEqual(this.props.data, nextProps.data) ||
            !_.isEqual(this.props.sitesAreDefined, nextProps.sitesAreDefined) ||
            !_.isEqual(this.props.isMapAvailable, nextProps.isMapAvailable) ||
            !_.isEqual(this.props.dimensions, nextProps.dimensions)
        );
    }

    componentDidUpdate(prevProps) {
        const { dimensions } = this.props;
        if (prevProps.dimensions !== dimensions) {
            this.mapRef.current.leafletElement.invalidateSize();
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
        const widgetDir = 'sitesMap';
        const { widgetResourceUrl } = Stage.Utils.Url;
        const markerIconPath = color => `/images/marker-icon-${color}.png`;
        const shadowUrl = widgetResourceUrl(widgetDir, '/images/marker-shadow.png', false);
        const showLabels = this.props.showAllLabels ? this._openPopup : undefined;

        _.forEach(this.props.data, site => {
            const iconUrl = widgetResourceUrl(widgetDir, markerIconPath(site.color), false);
            const icon = new L.Icon({
                iconUrl,
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const { Marker, Popup } = Stage.Basic.Leaflet;
            markers.push(
                <Marker
                    position={[site.latitude, site.longitude]}
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

    render() {
        const { Map, TileLayer } = Stage.Basic.Leaflet;
        const { isMapAvailable, mapUrl, sitesAreDefined } = this.props;
        if (!isMapAvailable) {
            const NO_INTERNET_MESSAGE = `The widget content cannot be displayed because there is no connection 
                                         to the maps repository (${mapUrl}).`;
            return <MapMessage text={NO_INTERNET_MESSAGE} />;
        }

        const markers = this._createMarkers();
        if (_.isEmpty(markers)) {
            return <NoDataMessage sitesAreDefined={sitesAreDefined} />;
        }

        const mapOptions = {
            zoom: 2.5,
            minZoom: 2,
            maxZoom: 18,
            position: [50, 0],
            bounds: [[-90, -180], [90, 180]],
            viscosity: 0.75
        };
        const tilesUrl = `${mapUrl}/osm-intl/{z}/{x}/{y}{r}.png?lang=en`;
        const attribution = '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>';

        return (
            <Map
                ref={this.mapRef}
                className="sites-map"
                center={mapOptions.position}
                zoom={mapOptions.zoom}
                maxBounds={mapOptions.bounds}
                maxBoundsViscosity={mapOptions.viscosity}
                minZoom={mapOptions.minZoom}
                maxZoom={mapOptions.maxZoom}
            >
                <TileLayer attribution={attribution} url={tilesUrl} />
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
