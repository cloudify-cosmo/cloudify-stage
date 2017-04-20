
const LOG_LEVELS = ['debug', 'info', 'warning', 'error', 'critical'];

export default class EventFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = EventFilter.initialState;
        this.dirty = {};
    }

    static initialState = {
        fields: {
            blueprintId: [],
            deploymentId: [],
            eventType: [],
            timeRange: "",
            timeStart: "",
            timeEnd: "",
            messageText: "",
            logLevel: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentDidMount() {
        this._resetFilter();
    }

    _renderLabel(data, index, defaultLabelProps) {
        return _.truncate(data.text, {'length': 10});
    }

    _updateFieldState(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields});
    }

    _handleInputChange(proxy, field) {
        this.dirty[field.name] = !_.isEmpty(field.value);

        if (field.name === 'timeRange') {
            this._updateFieldState('timeStart', field.startDate);
            this._updateFieldState('timeEnd', field.endDate);
        }
        this._updateFieldState(field.name, field.value);

        this.props.toolbox.getContext().setValue('eventFilter', this.state.fields);
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

        let fields = Object.assign({}, EventFilter.initialState.fields);
        this.setState({fields});
        this.props.toolbox.getContext().setValue('eventFilter', fields);

        this.props.toolbox.getEventBus().trigger('events:refresh');
        this.props.toolbox.getEventBus().trigger('logs:refresh');
    }

    render () {
        let {Form, Button, Icon} = Stage.Basic;

        let blueprints = Object.assign({}, {items:[]}, this.props.data.blueprints);
        let blueprintOptions = _.map(blueprints.items, item => { return {text: item.id, value: item.id} });

        let deployments = Object.assign({}, {items:[]}, this.props.data.deployments);
        let deploymentOptions = _.map(deployments.items, item => { return {text: item.id, value: item.id} });

        let types = Object.assign({}, {items:[]}, this.props.data.types);
        let typeOptions = _.map(types.items, item => { return {text: item.event_type, value: item.event_type} });

        let logOptions = _.map(LOG_LEVELS, item => { return {text: _.capitalize(item), value: item} });

        return (
            <Form size="small">
                <Form.Group inline widths="4">
                    <Form.Field>
                        <Form.Dropdown placeholder='Blueprints' fluid multiple search selection options={blueprintOptions}
                                       name="blueprintId" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.fields.blueprintId} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Deployments' fluid multiple search selection options={deploymentOptions}
                                       name="deploymentId" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.fields.deploymentId} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.InputDateRange fluid placeholder='Time Range' name="timeRange"
                                             value={this.state.fields.timeRange} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        {
                            this._isDirty() &&
                            <Button icon="remove" basic onClick={this._resetFilter.bind(this)}/>
                        }
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="4">
                    <Form.Field>
                        <Form.Dropdown placeholder='Log Levels' fluid multiple search selection options={logOptions}
                                       name="logLevel" closeOnChange
                                       value={this.state.fields.logLevel} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Event Types' fluid multiple search selection options={typeOptions}
                                       name="eventType" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.fields.eventType} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Input placeholder='Message Text' fluid name="messageText"
                                    value={this.state.fields.messageText} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}