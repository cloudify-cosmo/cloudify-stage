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

const { EventUtils } = Stage.Common;

const defaultEventTypeOptions = _.sortBy(
    _.map(_.keys(EventUtils.eventTypeOptions), event => ({
        ..._.pick(EventUtils.eventTypeOptions[event], ['text']),
        value: event
    })),
    event => event.text
);

const defaultLogLevelOptions = _.map(_.keys(EventUtils.logLevelOptions), log => ({
    ..._.pick(EventUtils.logLevelOptions[log], ['text', 'icon']),
    value: log
}));

function isDirty(fields) {
    return !_.every(initialFields, (value, name) => fields[name] === initialFields[name]);
}

const debouncedContextUpdate = _.debounce((toolbox, fields) => {
    toolbox.getContext().setValue(contextValueKey, fields);
}, 500);

function EventFilter({ toolbox }) {
    const { useState, useEffect } = React;

    const [fields, setFields] = useState(toolbox.getContext().getValue('eventFilter') || initialFields);
    const [options, setOptions] = useState({ eventType: defaultEventTypeOptions, logLevel: defaultLogLevelOptions });
    const [dirty, setDirty] = useState(isDirty(fields));

    function refreshFilter() {
        setFields({ ...initialFields, ...toolbox.getContext().getValue(contextValueKey) });
    }

    useEffect(() => {
        toolbox.getEventBus().on(refreshEvent, refreshFilter);
        return () => toolbox.getEventBus().off(refreshEvent, refreshFilter);
    }, []);

    useEffect(() => setDirty(isDirty(fields)), [JSON.stringify(fields)]);

    function renderLabel(data) {
        return _.truncate(data.text, { length: 30 });
    }

    function handleInputChange(proxy, field) {
        const updatedFields = { ...fields };
        updatedFields[field.name] = field.value;
        if (field.name === 'timeRange') {
            updatedFields.timeStart = _.isEmpty(field.value.start) ? '' : moment(field.value.start);
            updatedFields.timeEnd = _.isEmpty(field.value.end) ? '' : moment(field.value.end);
        }

        if (field.name === 'type') {
            if (field.value === EventUtils.logType) {
                updatedFields.eventType = [];
            } else if (field.value === EventUtils.eventType) {
                updatedFields.logLevel = [];
            }
        }

        if (field.name === 'logLevel') {
            updatedFields.eventType = [];
        }

        if (field.name === 'eventType') {
            updatedFields.logLevel = [];
        }

        setFields(updatedFields);
        debouncedContextUpdate(toolbox, updatedFields);
    }

    function handleOptionAddition(e, { name, value }) {
        setOptions({ ...options, [name]: [{ text: value, value }, ...options[name]] });
    }

    function resetFilter() {
        setDirty(false);
        setFields(initialFields);
        toolbox.getContext().setValue('eventFilter', initialFields);
        toolbox.getEventBus().trigger('events:refresh');
    }

    function isTypeSet(type) {
        return !fields.type || fields.type === type;
    }

    const { Form, Popup, DateRangeInput } = Stage.Basic;

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
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Dropdown
                        placeholder="Event Types"
                        fluid
                        multiple
                        search
                        selection
                        options={options.eventType}
                        name="eventType"
                        renderLabel={renderLabel}
                        additionLabel="Add custom Event Type: "
                        value={fields.eventType}
                        allowAdditions
                        disabled={!isTypeSet(EventUtils.eventType)}
                        onAddItem={handleOptionAddition}
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Dropdown
                        placeholder="Log Levels"
                        fluid
                        multiple
                        search
                        selection
                        options={options.logLevel}
                        name="logLevel"
                        allowAdditions
                        disabled={!isTypeSet(EventUtils.logType)}
                        additionLabel="Add custom Log Level: "
                        value={fields.logLevel}
                        onAddItem={handleOptionAddition}
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Popup
                        trigger={<Form.Button icon="undo" basic onClick={resetFilter} disabled={!dirty} />}
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
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="Message"
                    name="messageText"
                    fluid
                    value={fields.messageText}
                    onChange={handleInputChange}
                />
                <Form.Field>
                    <Form.DateRange
                        fluid
                        placeholder="Time Range"
                        name="timeRange"
                        ranges={timeRanges}
                        defaultValue={DateRangeInput.EMPTY_VALUE}
                        value={fields.timeRange}
                        onChange={handleInputChange}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
}

EventFilter.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

export default React.memo(EventFilter, _.isEqual);
