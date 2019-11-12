export default class EventFilter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.dirty = {};

        const { EventUtils } = Stage.Common;

        this.eventTypeOptions = _.sortBy(
            _.map(_.keys(EventUtils.eventTypeOptions), event => ({
                ..._.pick(EventUtils.eventTypeOptions[event], ['text']),
                value: event
            })),
            event => event.text
        );
        this.logLevelOptions = _.map(_.keys(EventUtils.logLevelOptions), log => ({
            ..._.pick(EventUtils.logLevelOptions[log], ['text', 'icon']),
            value: log
        }));

        this.debouncedContextUpdate = _.noop();

        this.state = EventFilter.initialState(this.eventTypeOptions, this.logLevelOptions);
    }

    static initialState = (eventTypeOptions, logLevelOptions) => ({
        fields: {
            eventType: [],
            timeRange: Stage.Basic.TimeFilter.EMPTY_VALUE,
            timeStart: '',
            timeEnd: '',
            type: '',
            messageText: '',
            operationText: '',
            logLevel: []
        },
        eventTypeOptions,
        logLevelOptions
    });

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state.fields, nextState.fields) || !_.isEqual(this.props, nextProps);
    }

    componentDidMount() {
        this.debouncedContextUpdate = _.debounce(
            () => this.props.toolbox.getContext().setValue('eventFilter', this.state.fields),
            500
        );
    }

    _renderLabel(data, index, defaultLabelProps) {
        return _.truncate(data.text, { length: 30 });
    }

    _handleInputChange(proxy, field) {
        const { EventUtils } = Stage.Common;
        this.dirty[field.name] = !_.isEmpty(field.value);

        const fields = { ...this.state.fields };
        fields[field.name] = field.value;
        if (field.name === 'timeRange') {
            fields.timeStart = _.isEmpty(field.value.start) ? '' : moment(field.value.start);
            fields.timeEnd = _.isEmpty(field.value.end) ? '' : moment(field.value.end);
        }

        if (field.name === 'type') {
            if (field.value === EventUtils.logType) {
                fields.eventType = [];
            } else if (field.value === EventUtils.eventType) {
                fields.logLevel = [];
            }
        }

        if (field.name === 'logLevel') {
            fields.eventType = [];
        }

        if (field.name === 'eventType') {
            fields.logLevel = [];
        }

        this.setState({ fields }, this.debouncedContextUpdate);
    }

    _handleOptionAddition(e, { name, value }) {
        this.setState({ [`${name}Options`]: [{ text: value, value }, ...this.state[`${name}Options`]] });
    }

    _isDirty() {
        let res = false;
        _.forEach(this.dirty, function(value, key) {
            res = res || value;
        });

        return res;
    }

    _resetFilter() {
        this.dirty = {};

        const fields = { ...EventFilter.initialState({}, {}).fields };
        this.setState({ fields }, () => {
            this.props.toolbox.getContext().setValue('eventFilter', fields);

            this.props.toolbox.getEventBus().trigger('events:refresh');
        });
    }

    _isTypeSet(type) {
        return !this.state.fields.type || this.state.fields.type === type;
    }

    render() {
        const { Form, Popup, TimeFilter } = Stage.Basic;
        const { EventUtils } = Stage.Common;

        const timeRanges = {
            'Last 15 Minutes': {
                start: moment()
                    .subtract(15, 'minutes')
                    .format(TimeFilter.DATETIME_FORMAT),
                end: ''
            },
            'Last 30 Minutes': {
                start: moment()
                    .subtract(30, 'minutes')
                    .format(TimeFilter.DATETIME_FORMAT),
                end: ''
            },
            'Last Hour': {
                start: moment()
                    .subtract(1, 'hours')
                    .format(TimeFilter.DATETIME_FORMAT),
                end: ''
            },
            'Last 2 Hours': {
                start: moment()
                    .subtract(2, 'hours')
                    .format(TimeFilter.DATETIME_FORMAT),
                end: ''
            },
            'Last Day': {
                start: moment()
                    .subtract(1, 'days')
                    .format(TimeFilter.DATETIME_FORMAT),
                end: ''
            },
            'Last Week': {
                start: moment()
                    .subtract(1, 'weeks')
                    .format(TimeFilter.DATETIME_FORMAT),
                end: ''
            }
        };

        return (
            <Form size="small">
                <Form.Group inline widths="equal">
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Type"
                            fluid
                            selection
                            options={EventUtils.typesOptions}
                            name="type"
                            value={this.state.fields.type}
                            onChange={this._handleInputChange.bind(this)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Event Types"
                            fluid
                            multiple
                            search
                            selection
                            options={this.state.eventTypeOptions}
                            name="eventType"
                            renderLabel={this._renderLabel.bind(this)}
                            additionLabel="Add custom Event Type: "
                            value={this.state.fields.eventType}
                            allowAdditions
                            disabled={!this._isTypeSet(EventUtils.eventType)}
                            onAddItem={this._handleOptionAddition.bind(this)}
                            onChange={this._handleInputChange.bind(this)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Log Levels"
                            fluid
                            multiple
                            search
                            selection
                            options={this.state.logLevelOptions}
                            name="logLevel"
                            allowAdditions
                            disabled={!this._isTypeSet(EventUtils.logType)}
                            additionLabel="Add custom Log Level: "
                            value={this.state.fields.logLevel}
                            onAddItem={this._handleOptionAddition.bind(this)}
                            onChange={this._handleInputChange.bind(this)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Popup
                            trigger={
                                <Form.Button
                                    icon="undo"
                                    basic
                                    onClick={this._resetFilter.bind(this)}
                                    disabled={!this._isDirty()}
                                />
                            }
                            content="Reset filter"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="equal">
                    <Form.Input
                        placeholder="Operation"
                        name="operationText"
                        fluid
                        value={this.state.fields.operationText}
                        onChange={this._handleInputChange.bind(this)}
                    />
                    <Form.Input
                        placeholder="Message"
                        name="messageText"
                        fluid
                        value={this.state.fields.messageText}
                        onChange={this._handleInputChange.bind(this)}
                    />
                    <Form.Field>
                        <TimeFilter
                            fluid
                            placeholder="Time Range"
                            name="timeRange"
                            ranges={timeRanges}
                            defaultValue={TimeFilter.EMPTY_VALUE}
                            value={this.state.fields.timeRange}
                            onChange={this._handleInputChange.bind(this)}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}
