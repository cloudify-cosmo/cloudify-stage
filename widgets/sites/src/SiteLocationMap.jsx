function toLatLng(value) {
    return _(value)
        .split(',')
        .map(v => parseFloat(v) || 0)
        .concat(0, 0)
        .take(2)
        .value();
}

class SiteLocationMap extends React.Component {
    constructor(props, context) {
        super(props, context);
        const { location } = this.props;
        this.initialLocation = location;
        this.state = {
            isMapAvailable: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        const { MapsActions } = Stage.Common;

        return new MapsActions(toolbox).isAvailable().then(isMapAvailable => this.setState({ isMapAvailable }));
    }

    render() {
        const { Leaflet, Loading, Message } = Stage.Basic;
        const { Consts, createMarkerIcon } = Stage.Common;
        const { mapOptions: defaultMapOptions, initialZoom, urlTemplate } = Consts.leaflet;

        const { attribution, location, mapOptions } = this.props;
        const { isMapAvailable } = this.state;

        const url = Stage.Utils.Url.url(urlTemplate);

        if (isMapAvailable === null) {
            return (
                <div style={{ width: 50, height: 50, margin: '0 auto' }}>
                    <Loading />
                </div>
            );
        }

        if (isMapAvailable === false) {
            const NO_INTERNET_MESSAGE = `Map cannot be displayed because there is no connection 
                                         to the maps repository. Please check network connection.`;
            return (
                <Message warning style={{ display: 'block' }}>
                    {NO_INTERNET_MESSAGE}
                </Message>
            );
        }

        return (
            <Leaflet.Map
                style={mapOptions.style}
                onClick={mapOptions.onClick}
                zoomControl={mapOptions.zoomControl}
                minZoom={defaultMapOptions.minZoom}
                maxZoom={defaultMapOptions.maxZoom}
                maxBounds={defaultMapOptions.maxBounds}
                maxBoundsViscosity={defaultMapOptions.maxBoundsViscosity}
                zoom={initialZoom}
                center={toLatLng(this.initialLocation)}
            >
                <Leaflet.TileLayer attribution={attribution} url={url} />
                {location && <Leaflet.Marker position={toLatLng(location)} icon={createMarkerIcon('grey')} />}
            </Leaflet.Map>
        );
    }
}

/**
 * @property {string} attribution - map attribution to be added to map view
 * @property {string} location - location, format: "<latitude>, <longitude>"
 * @property {object} mapOptions - props to be passed to Leaflet.Map component
 * @property {object} toolbox Toolbox object
 */
SiteLocationMap.propTypes = {
    attribution: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    mapOptions: PropTypes.shape({ onClick: PropTypes.func, style: PropTypes.object, zoomControl: PropTypes.bool })
        .isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

export default connectToStore(state => _.get(state, 'config.app.maps', () => ({})), {})(SiteLocationMap);
