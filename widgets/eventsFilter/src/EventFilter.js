
const LOG_LEVELS = ['debug', 'info', 'warning', 'error', 'critical'];

export default class EventFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = EventFilter.initialState;
        this.dirty = {};
    }

    static initialState = {
        blueprintId: [],
        deploymentId: [],
        eventType: [],
        timeStart: "",
        timeEnd: "",
        messageText: "",
        logLevel: []
    }

    _renderLabel(data, index, defaultLabelProps) {
        return _.truncate(data.text, {'length': 10});
    }

    _handleInputChange(proxy, field) {
        this.props.toolbox.getContext().setValue(`event_${field.name}`, field.type==='date'?field.date:field.value);

        this.dirty[field.name] = !_.isEmpty(field.value);
        this.setState(Stage.Basic.Form.fieldNameValue(field));
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
        this.setState(EventFilter.initialState);

        var params = {};
        _.forIn(EventFilter.initialState, (value, key) => {
            this.props.toolbox.getContext().setValue(`event_${key}`,value);
        });

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
                <Form.Group inline widths="5">
                    <Form.Field>
                        <Form.Dropdown placeholder='Blueprints' fluid multiple search selection options={blueprintOptions}
                                       name="blueprintId" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.blueprintId} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Deployments' fluid multiple search selection options={deploymentOptions}
                                       name="deploymentId" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.deploymentId} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Log Levels' fluid multiple search selection options={logOptions}
                                       name="logLevel" closeOnChange
                                       value={this.state.logLevel} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Event Types' fluid multiple search selection options={typeOptions}
                                       name="eventType" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.eventType} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        {
                            this._isDirty() &&
                            <Button icon="remove" basic onClick={this._resetFilter.bind(this)}/>
                        }
                    </Form.Field>
                </Form.Group>
                <Form.Group inline widths="5">
                    <Form.Field>
                        <Form.InputDate placeholder='Time Start' name="timeStart"
                                        value={this.state.timeStart} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.InputDate placeholder='Time End' name="timeEnd"
                                        value={this.state.timeEnd} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Input placeholder='Message Text' fluid name="messageText"
                                    value={this.state.messageText} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}