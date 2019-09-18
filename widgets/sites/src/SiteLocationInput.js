import SiteLocationMap from './SiteLocationMap';

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

    render() {
        const { Button, Form } = Stage.Basic;

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
                    <SiteLocationMap
                        location={this.state.value}
                        mapOptions={{
                            onClick: e => this.onLocationChange(`${e.latlng.lat}, ${e.latlng.lng}`),
                            style: { height: 'calc(100vh - 344px)', maxHeight: 460, marginTop: -14, cursor: 'pointer' }
                        }}
                    />
                )}
            </>
        );
    }
}
