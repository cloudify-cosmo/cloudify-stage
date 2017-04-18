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
        start: '',
        end: '',
        resolution: 1,
        unit: 'm'
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
        this.startDate = null;
        this.endDate = null;
        this.currentDate = new Date();
    }

    _handleDateChange(proxy, field) {
        this[`${field.name}Date`] = field.date;
        this._handleInputChange(proxy, field);
    }

    _handleInputChange(proxy, field) {
        this.props.toolbox.getContext().setValue(`time_${field.name}`, field.type==='date'?field.date:field.value);
        this.dirty = this.dirty || !_.isEmpty(field.value);
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _resetFilter() {
        this._initVars();
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
                                        maxDate={this.endDate}
                                        value={this.state.start} onChange={this._handleDateChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.InputDate fluid placeholder='Time End' name="end"
                                        minDate={this.startDate} maxDate={this.currentDate}
                                        value={this.state.end} onChange={this._handleDateChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Button disabled={!this.dirty} icon="remove" basic floated="right"
                                onClick={this._resetFilter.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="3">
                    <Form.Field>
                        <Form.Input fluid type='number' name="resolution" label='Time Resolution'
                                    max={Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE}
                                    min={Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE}
                                    value={this.state.resolution} onChange={this._handleInputChange.bind(this)} />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown fluid options={Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS} name="unit" search selection
                                       value={this.state.unit} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}
