/**
 * Created by jakubniezgoda on 20/03/2017.
 */

export default class TimeFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = TimeFilter.initialState;
        this._initVars();
    }


    static initialState = {
        fields : {
            range: '',
            start: '',
            end: '',
            resolution: 1,
            unit: 'm'
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState;
    }

    componentDidMount() {
        this._resetFilter();
    }

    _initVars() {
        this.dirty = false;
    }

    _updateFieldState(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields});
    }

    _handleTimeRangeChange(proxy, field) {
        this._updateFieldState('start', field.startDate);
        this._updateFieldState('end', field.endDate);
        this._handleInputChange(proxy, field);
    }

    _handleInputChange(proxy, field) {
        this.dirty = this.dirty || !_.isEmpty(field.value);
        this._updateFieldState(field.name, field.value);
        this.props.toolbox.getContext().setValue('timeFilter', this.state.fields);
    }

    _resetFilter() {
        this._initVars();
        let fields = Object.assign({}, TimeFilter.initialState.fields);
        this.setState({fields});
        this.props.toolbox.getContext().setValue('timeFilter', fields);

        this.props.toolbox.getEventBus().trigger('graph:refresh');
    }

    render () {
        let {Form, Button} = Stage.Basic;

        return (
            <Form size="small">
                <Form.Group inline widths="2">
                    <Form.Field>
                        <Form.InputDateRange fluid placeholder='Time Range' name="range"
                                             value={this.state.fields.range} onChange={this._handleTimeRangeChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Button disabled={!this.dirty} icon="remove" basic floated="right"
                                onClick={this._resetFilter.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="2">
                    <Form.Field>
                        <Form.Input fluid type='number' name="resolution" label='Time Resolution'
                                    max={Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE}
                                    min={Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE}
                                    value={this.state.fields.resolution} onChange={this._handleInputChange.bind(this)} />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown fluid options={Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS} name="unit" search selection
                                       value={this.state.fields.unit} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}
