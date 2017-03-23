/**
 * Created by jakubniezgoda on 20/03/2017.
 */

export default class TimeFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = TimeFilter.initialState;
        this.dirty = {};
    }

    static MAX_RESOLUTION_VALUE = 1000;
    static MIN_RESOLUTION_VALUE = 1;
    static TIME_RESOLUTION_UNITS = [
        {text: 'microseconds', value: 'u'},
        {text: 'milliseconds', value: 'ms'},
        {text: 'seconds', value: 's'},
        {text: 'minutes', value: 'm'},
        {text: 'hours', value: 'h'},
        {text: 'days', value: 'd'},
        {text: 'weeks', value: 'w'}
    ];

    static initialState = {
        start: '',
        end: '',
        startDate: null,
        endDate: new Date(),
        resolution: 1,
        unit: 'm'
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this._resetFilter();
    }

    _handleInputChange(proxy, field) {
        if (field.name === 'resolution' && (field.value < TimeFilter.MIN_RESOLUTION_VALUE || field.value > TimeFilter.MAX_RESOLUTION_VALUE)) {
            return;
        }
        this.props.toolbox.getContext().setValue(`time_${field.name}`, field.type==='date'?field.date:field.value);

        this.dirty[field.name] = !_.isEmpty(field.value);
        this.setState(Stage.Basic.Form.fieldNameValue(field));

        if (field.type === 'date') {
            this.setState({[`${field.name}Date`]: field.date});
        }
    }

    _isDirty() {
        var res = false;
        _.forEach(this.dirty, function(value, key) {
            res = res || value;
        });

        return res;
    }

    _resetFilter() {
        this.dirty = {};
        this.setState(TimeFilter.initialState);

        _.forIn(TimeFilter.initialState, (value, key) => {
            this.props.toolbox.getContext().setValue(`time_${key}`, value);
        });

        this.props.toolbox.getEventBus().trigger('graph:refresh');
    }

    render () {
        let {Form, Button} = Stage.Basic;


        return (
            <Form size="small">
                <Form.Group inline widths="3">
                    <Form.Field>
                        <Form.InputDate fluid placeholder='Time Start' name="start"
                                        maxDate={this.state.endDate}
                                        value={this.state.start} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.InputDate fluid placeholder='Time End' name="end"
                                        minDate={this.state.startDate}
                                        value={this.state.end} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Button disabled={!this._isDirty()} icon="remove" basic floated="right"
                                onClick={this._resetFilter.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="3">
                    <Form.Field>
                        <Form.Input fluid type='number' name="resolution" label='Time Resolution'
                                    value={this.state.resolution} onChange={this._handleInputChange.bind(this)} />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown fluid options={TimeFilter.TIME_RESOLUTION_UNITS} name="unit" search selection
                                       value={this.state.unit} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}
