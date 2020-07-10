const contextValueKey = 'eventFilter';
const refreshEvent = 'eventsFilter:refresh';

const initialFields = Object.freeze({
    eventType: [],
    timeRange: Stage.Basic.DateRangeInput.EMPTY_VALUE,
    timeStart: '',
    timeEnd: '',
    type: '',
    messageText: '',
    operationText: '',
    logLevel: []
});

function isDirty(fields) {
    return !_.every(initialFields, (value, name) => fields[name] === initialFields[name]);
}

export default class EventFilter extends React.Component {
    constructor(props, context) {
        super(props, context);

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

        const { toolbox } = this.props;
        const fieldsFromContext = toolbox.getContext().getValue('eventFilter');
        this.state = EventFilter.initialState(this.eventTypeOptions, this.logLevelOptions, fieldsFromContext);

        this.renderLabel = this.renderLabel.bind(this);
        this.handleOptionAddition = this.handleOptionAddition.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }

    static initialState = (eventTypeOptions, logLevelOptions, fields = initialFields) => ({
        fields,
        eventTypeOptions,
        logLevelOptions,
        dirty: isDirty(fields)
    });

    shouldComponentUpdate(nextProps, nextState) {
        const { props, state } = this;
        return !_.isEqual(state, nextState) || !_.isEqual(props, nextProps);
    }

    componentDidMount() {
        const { toolbox } = this.props;
        this.debouncedContextUpdate = _.debounce(() => {
            const { fields } = this.state;
            toolbox.getContext().setValue(contextValueKey, fields);
        }, 500);
        toolbox.getEventBus().on(refreshEvent, this.refreshFilter, this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { fields } = this.state;

        if (!_.isEqual(fields, prevState.fields)) {
            this.setState({ dirty: isDirty(fields) });
        }
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off(refreshEvent, this.refreshFilter);
    }

    refreshFilter() {
        const { toolbox } = this.props;
        const fields = toolbox.getContext().getValue(contextValueKey);
        this.setState({ fields: { ...initialFields, ...fields } });
    }

    renderLabel(data, index, defaultLabelProps) {
        return _.truncate(data.text, { length: 30 });
    }

    handleInputChange(proxy, field) {
        const { fields: stateFields } = this.state;
        const { EventUtils } = Stage.Common;

        const fields = { ...stateFields };
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

    handleOptionAddition(e, { name, value }) {
        const { state } = this;
        this.setState({ [`${name}Options`]: [{ text: value, value }, ...state[`${name}Options`]] });
    }

    resetFilter() {
        const { toolbox } = this.props;

        const fields = { ...EventFilter.initialState({}, {}).fields };
        this.setState({ dirty: false, fields }, () => {
            toolbox.getContext().setValue('eventFilter', fields);

            toolbox.getEventBus().trigger('events:refresh');
        });
    }

    isTypeSet(type) {
        const { fields } = this.state;
        return !fields.type || fields.type === type;
    }

    render() {
        const { dirty, eventTypeOptions, fields, logLevelOptions } = this.state;
        const { Form, Popup, DateRangeInput } = Stage.Basic;
        const { EventUtils } = Stage.Common;

        const timeRanges = {
            'Last 15 Minutes': {
                start: moment()
                    .subtract(15, 'minutes')
                    .format(DateRangeInput.DATETIME_FORMAT),
                end: ''
            },
            'Last 30 Minutes': {
                start: moment()
                    .subtract(30, 'minutes')
                    .format(DateRangeInput.DATETIME_FORMAT),
                end: ''
            },
            'Last Hour': {
                start: moment()
                    .subtract(1, 'hours')
                    .format(DateRangeInput.DATETIME_FORMAT),
                end: ''
            },
            'Last 2 Hours': {
                start: moment()
                    .subtract(2, 'hours')
                    .format(DateRangeInput.DATETIME_FORMAT),
                end: ''
            },
            'Last Day': {
                start: moment()
                    .subtract(1, 'days')
                    .format(DateRangeInput.DATETIME_FORMAT),
                end: ''
            },
            'Last Week': {
                start: moment()
                    .subtract(1, 'weeks')
                    .format(DateRangeInput.DATETIME_FORMAT),
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
                            value={fields.type}
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Event Types"
                            fluid
                            multiple
                            search
                            selection
                            options={eventTypeOptions}
                            name="eventType"
                            renderLabel={this.renderLabel}
                            additionLabel="Add custom Event Type: "
                            value={fields.eventType}
                            allowAdditions
                            disabled={!this.isTypeSet(EventUtils.eventType)}
                            onAddItem={this.handleOptionAddition}
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Log Levels"
                            fluid
                            multiple
                            search
                            selection
                            options={logLevelOptions}
                            name="logLevel"
                            allowAdditions
                            disabled={!this.isTypeSet(EventUtils.logType)}
                            additionLabel="Add custom Log Level: "
                            value={fields.logLevel}
                            onAddItem={this.handleOptionAddition}
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Popup
                            trigger={<Form.Button icon="undo" basic onClick={this.resetFilter} disabled={!dirty} />}
                            content="Reset filter"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="equal">
                    <Form.Input
                        placeholder="Operation"
                        name="operationText"
                        fluid
                        value={fields.operationText}
                        onChange={this.handleInputChange}
                    />
                    <Form.Input
                        placeholder="Message"
                        name="messageText"
                        fluid
                        value={fields.messageText}
                        onChange={this.handleInputChange}
                    />
                    <Form.Field>
                        <Form.DateRange
                            fluid
                            placeholder="Time Range"
                            name="timeRange"
                            ranges={timeRanges}
                            defaultValue={DateRangeInput.EMPTY_VALUE}
                            value={fields.timeRange}
                            onChange={this.handleInputChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}
