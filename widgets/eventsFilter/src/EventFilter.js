
const LOG_LEVELS = ['debug', 'info', 'warning', 'error', 'critical'];

const EVENT_TYPE = 'cloudify_event';
const LOG_TYPE = 'cloudify_log';
const TYPES = [{text: '', value: ''}, {text: 'Logs', value: LOG_TYPE}, {text: 'Events', value: EVENT_TYPE}];

export default class EventFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = EventFilter.initialState;
        this.dirty = {};

        this.actions = new Stage.Common.EventActions();
        this.debouncedContextUpdate = _.noop();
    }

    static initialState = {
        fields: {
            blueprintId: [],
            deploymentId: [],
            eventType: [],
            timeRange: Stage.Basic.TimeFilter.EMPTY_VALUE,
            timeStart: '',
            timeEnd: '',
            type: '',
            messageText: '',
            logLevel: []
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state.fields, nextState.fields)
            || !_.isEqual(this.props, nextProps);
    }

    componentDidMount() {
        this._resetFilter();

        this.debouncedContextUpdate
            = _.debounce(() => this.props.toolbox.getContext().setValue('eventFilter', this.state.fields), 500);
    }

    _renderLabel(data, index, defaultLabelProps) {
        return _.truncate(data.text, {'length': 30});
    }

    _handleInputChange(proxy, field) {
        this.dirty[field.name] = !_.isEmpty(field.value);

        let fields = Object.assign({}, this.state.fields);
        fields[field.name] = field.value;
        if (field.name === 'timeRange') {
            fields['timeStart'] = _.isEmpty(field.value.start) ? '' : moment(field.value.start);
            fields['timeEnd'] = _.isEmpty(field.value.end) ? '' : moment(field.value.end);
        }

        this.setState({fields}, this.debouncedContextUpdate);
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
        this.setState({fields}, () => {
            this.props.toolbox.getContext().setValue('eventFilter', fields);

            this.props.toolbox.getEventBus().trigger('events:refresh');
            this.props.toolbox.getEventBus().trigger('logs:refresh');
        });
    }

    _isTypeSet(type) {
        return !this.state.fields.type || this.state.fields.type === type;
    }

    render () {
        let {Form, Button, TimeFilter} = Stage.Basic;

        let blueprints = Object.assign({}, {items:[]}, this.props.data.blueprints);
        let blueprintOptions = _.map(blueprints.items, item => { return {text: item.id, value: item.id} });
        let blueprintIdInContext = this.props.toolbox.getContext().getValue('blueprintId');
        let blueprintId = blueprintIdInContext || this.state.fields.blueprintId;

        let deployments = Object.assign({}, {items:[]}, this.props.data.deployments);
        let deploymentOptions = _.map(deployments.items, item => { return {text: item.id, value: item.id} });
        let deploymentIdInContext = this.props.toolbox.getContext().getValue('deploymentId');
        let deploymentId = deploymentIdInContext || this.state.fields.deploymentId;

        let eventTypes = Object.assign({}, {items:[]}, this.props.data.eventTypes);
        let typeOptions = _.map(eventTypes.items, item => { return {text: this.actions.getEventDef(item.event_type).text, value: item.event_type} });

        let logOptions = _.map(LOG_LEVELS, item => { return {text: _.capitalize(item), value: item} });

        let timeRanges = {
            'Last 15 Minutes': {start: moment().subtract(15, 'minutes').format(TimeFilter.DATETIME_FORMAT), end: ''},
            'Last 30 Minutes': {start: moment().subtract(30, 'minutes').format(TimeFilter.DATETIME_FORMAT), end: ''},
            'Last Hour': {start: moment().subtract(1, 'hours').format(TimeFilter.DATETIME_FORMAT), end: ''},
            'Last 2 Hours': {start: moment().subtract(2, 'hours').format(TimeFilter.DATETIME_FORMAT), end: ''},
            'Last Day': {start: moment().subtract(1, 'days').format(TimeFilter.DATETIME_FORMAT), end: ''},
            'Last Week': {start: moment().subtract(1, 'weeks').format(TimeFilter.DATETIME_FORMAT), end: ''}
        };

        return (
            <Form size="small">
                <Form.Group inline widths="4">
                    <Form.Field>
                        <Form.Dropdown placeholder='Type' fluid selection options={TYPES}
                                       name="type" closeOnChange
                                       value={this.state.fields.type} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        {
                            !blueprintIdInContext && !deploymentIdInContext &&
                            <Form.Dropdown placeholder='Blueprints'
                                           fluid multiple search selection options={blueprintOptions}
                                           name="blueprintId" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                           value={blueprintId} onChange={this._handleInputChange.bind(this)} />

                        }
                    </Form.Field>
                    <Form.Field>
                        {
                            !deploymentIdInContext &&
                            <Form.Dropdown placeholder='Deployments' fluid multiple search selection options={deploymentOptions}
                                           name="deploymentId" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                           value={deploymentId} onChange={this._handleInputChange.bind(this)} />
                        }
                    </Form.Field>
                    <Form.Field>
                        {
                            this._isDirty() &&
                            <Button icon="remove" basic onClick={this._resetFilter.bind(this)}/>
                        }
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="4">
                    {this._isTypeSet(EVENT_TYPE) &&
                    <Form.Field>
                        <Form.Dropdown placeholder='Event Types' fluid multiple search selection options={typeOptions}
                                       name="eventType" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.fields.eventType}
                                       onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    }
                    {this._isTypeSet(LOG_TYPE) &&
                    <Form.Field>
                        <Form.Dropdown placeholder='Log Levels' fluid multiple search selection options={logOptions}
                                       name="logLevel" closeOnChange
                                       value={this.state.fields.logLevel}
                                       onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    }
                    <Form.Field>
                        <Form.Input placeholder='Message Text' fluid name="messageText"
                                    value={this.state.fields.messageText} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <TimeFilter fluid placeholder='Time Range' name="timeRange"
                                    addTimeResolution={false} ranges={timeRanges} dateSyntax={TimeFilter.ISO_8601_DATE_SYNTAX}
                                    defaultValue={TimeFilter.EMPTY_VALUE} value={this.state.fields.timeRange}
                                    onChange={this._handleInputChange.bind(this)} />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}