import { get } from 'lodash';
import type { LatLngExpression, LeafletEventHandlerFnMap } from 'leaflet';
import type { CSSProperties } from 'react';

function toLatLng(location: string) {
    return _(location)
        .split(',')
        .map(value => parseFloat(value) || 0)
        .concat(0, 0)
        .take(2)
        .value() as LatLngExpression;
}

interface MapOptions {
    onClick?: LeafletEventHandlerFnMap['click'];
    style?: CSSProperties;
    zoomControl?: boolean;
}

interface SiteLocationMapProps {
    /**
     * @property {string} location - location, format: "<latitude>, <longitude>"
     */
    location: string;
    /**
     * @property {object} mapOptions - props to be passed to Leaflet.Map component
     */
    mapOptions: MapOptions;
    /**
     * @property {object} toolbox Toolbox object
     */
    toolbox: Stage.Types.Toolbox;
}

interface SiteLocationMapState {
    isMapAvailable: boolean | null;
}

class SiteLocationMap extends React.Component<SiteLocationMapProps, SiteLocationMapState> {
    initialLocation: string;

    constructor(props: SiteLocationMapProps) {
        super(props);
        const { location } = this.props;
        this.initialLocation = location;
        this.state = {
            isMapAvailable: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        const MapsActions = Stage.Common.Map.Actions;

        return new MapsActions(toolbox).isAvailable().then(isMapAvailable => this.setState({ isMapAvailable }));
    }

    render() {
        const { Leaflet, Loading, Message } = Stage.Basic;
        const { Consts } = Stage.Common;
        const { createMarkerIcon } = Stage.Common.Map;
        const { mapOptions: defaultMapOptions, initialZoom, urlTemplate } = Consts.leaflet;

        const { location, mapOptions } = this.props;
        const { isMapAvailable } = this.state;

        const url = Stage.Utils.Url.url(urlTemplate);

        if (isMapAvailable === undefined) {
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
                <Leaflet.TileLayer url={url} />
                {location && <Leaflet.Marker position={toLatLng(location)} icon={createMarkerIcon('grey')} />}
            </Leaflet.Map>
        );
    }
}

export default connectToStore(state => get(state, 'config.app.maps', () => ({})), {})(SiteLocationMap);
