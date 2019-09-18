import createMarkerIcon from '../../common/src/MarkerIcon';

export default class SiteLocationMap extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initialLocation = this.props.location;
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
        const { Leaflet } = Stage.Basic;
        return (
            <Leaflet.Map
                {...this.props.mapOptions}
                {...Stage.Common.Consts.leaflet.mapOptions}
                zoom={Stage.Common.Consts.leaflet.initialZoom}
                center={this.toLatLng(this.initialLocation)}
            >
                <Leaflet.TileLayer
                    // TODO: temporarily hardcoded, should be parametrized as part of CY-1593
                    attribution="<a href='https://wikimediafoundation.org/wiki/Maps_Terms_of_Use'>Wikimedia</a>"
                    url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png?lang=en"
                />
                {this.props.location && (
                    <Leaflet.Marker position={this.toLatLng(this.props.location)} icon={createMarkerIcon('grey')} />
                )}
            </Leaflet.Map>
        );
    }
}
