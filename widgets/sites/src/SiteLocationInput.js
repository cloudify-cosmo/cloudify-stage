import SiteLocationMap from './SiteLocationMap';

export default class SiteLocationInput extends React.Component {
    /**
     * propTypes
     *
     * @property {function} onChange - function to be called on value change
     * @property {string} value - location, format: "<latitude>, <longitude>"
     */
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            mapOpen: false,
            value: props.value || ''
        };
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;

        if (value !== prevProps.value) {
            this.setState(_.pick(this.props, 'value'));
        }
    }

    onLocationChange(value) {
        const { onChange } = this.props;

        this.setState({ value }, () => onChange(null, { name: 'siteLocation', value }));
    }

    render() {
        const { Button, Form } = Stage.Basic;
        const { mapOpen, value } = this.state;

        return (
            <>
                <Form.Input
                    label="Location"
                    value={value}
                    placeholder="latitude, longitude (32.166369, 34.810893)"
                    onChange={(e, data) => this.onLocationChange(data.value)}
                    action={
                        <Button
                            active={mapOpen}
                            icon="crosshairs"
                            onClick={() => this.setState({ mapOpen: !mapOpen })}
                        />
                    }
                />
                {mapOpen && (
                    <SiteLocationMap
                        location={value}
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
