export default class SiteLocationInput extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { value: this.props.value || '' };
    }

    componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            this.setState(_.pick(this.props, 'value'));
        }
    }

    onLocationChange(value) {
        this.setState({ value });
        this.props.onChange(null, { name: 'siteLocation', value });
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
        const { Button, Form, Leaflet } = Stage.Basic;

        return (
            <>
                <Form.Input
                    label="Location"
                    value={this.state.value}
                    placeholder="latitude, longitude (32.166369, 34.810893)"
                    onChange={(e, data) => this.onLocationChange(data.value)}
                    action={<Button icon="crosshairs" onClick={() => this.setState({ mapOpen: true })} />}
                />
                {this.state.mapOpen && (
                    <Leaflet.Map
                        style={{ height: 'calc(100vh - 344px)', maxHeight: 460, marginTop: -14, cursor: 'pointer' }}
                        {...Stage.Common.Consts.leaflet.mapOptions}
                        zoom={Stage.Common.Consts.leaflet.initialZoom}
                        center={this.toLatLng(this.props.value)}
                        onClick={e => this.onLocationChange(`${e.latlng.lat}, ${e.latlng.lng}`)}
                    >
                        <Leaflet.TileLayer
                            // TODO: temporarily hardcoded, should be parametrized as part of CY-1593
                            attribution="<a href='https://wikimediafoundation.org/wiki/Maps_Terms_of_Use'>Wikimedia</a>"
                            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png?lang=en"
                        />
                        {this.state.value && (
                            <Leaflet.Marker
                                position={this.toLatLng(this.state.value)}
                                icon={
                                    new L.Icon({
                                        iconUrl: Stage.Utils.Url.widgetResourceUrl(
                                            'sites',
                                            '/images/marker-icon.png',
                                            false
                                        ),
                                        shadowUrl: Stage.Utils.Url.widgetResourceUrl(
                                            'sites',
                                            '/images/marker-shadow.png',
                                            false
                                        ),
                                        iconAnchor: [12, 41]
                                    })
                                }
                            />
                        )}
                    </Leaflet.Map>
                )}
            </>
        );
    }
}
