class SiteLocationMap extends React.Component {
    /**
     * propTypes
     *
     * @property {string} attribution - map attribution to be added to map view
     * @property {string} location - location, format: "<latitude>, <longitude>"
     * @property {object} mapOptions - props to be passed to Leaflet.Map component
     * @property {string} mapUrl - map provider URL
     * @property {string} tilesUrlTemplate - map tiles provider template URL
     * @property {object} toolbox Toolbox object
     */
    static propTypes = {
        attribution: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        mapOptions: PropTypes.object.isRequired,
        mapUrl: PropTypes.string.isRequired,
        tilesUrlTemplate: PropTypes.string.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.initialLocation = this.props.location;
        this.state = {
            isMapAvailable: true
        };
    }

    componentDidMount() {
        const { mapUrl } = this.props;
        this.props.toolbox
            .getExternal()
            .isReachable(mapUrl)
            .then(isMapAvailable => this.setState({ isMapAvailable }));
    }

    toLatLng(value) {
        return _(value)
            .split(',')
            .map(v => parseFloat(v) || 0)
            .concat(0, 0)
            .take(2)
            .value();
    }

    render() {
        const { Leaflet, Message } = Stage.Basic;
        const { Consts, createMarkerIcon } = Stage.Common;

        const { attribution, location, mapOptions, tilesUrlTemplate } = this.props;
        const { isMapAvailable } = this.state;

        if (!isMapAvailable) {
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
                {...mapOptions}
                {...Consts.leaflet.mapOptions}
                zoom={Consts.leaflet.initialZoom}
                center={this.toLatLng(this.initialLocation)}
            >
                <Leaflet.TileLayer attribution={attribution} url={tilesUrlTemplate} />
                {location && <Leaflet.Marker position={this.toLatLng(location)} icon={createMarkerIcon('grey')} />}
            </Leaflet.Map>
        );
    }
}

export default connectToStore(state => _.get(state, 'config.app.maps', () => ({})), {})(SiteLocationMap);
