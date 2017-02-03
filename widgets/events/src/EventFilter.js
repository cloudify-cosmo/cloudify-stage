
export default class EventFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = EventFilter.initialState;
        this.dirty = {};
    }

    static initialState = {
        blueprint_id: [],
        deployment_id: [],
        event_type: [],
        time_start: "",
        time_end: "",
        message_text: ""
    }

    _renderLabel(data, index, defaultLabelProps) {
        return _.truncate(data.text, {'length': 10});
    }

    _mapFieldToParam(name, value) {
        let param = {[name]: value};
        if (name === 'time_start') {
            param = {_range: `@timestamp,${value},${this.state.time_end}`};
        } else if (name === 'time_end') {
            param = {_range: `@timestamp,${this.state.time_start},${value}`};
        } else if (name === 'message_text') {
            param = {'message.text': value};
        }

        return param;
    }

    _handleInputChange(proxy, field) {
        this.dirty[field.name] = !_.isEmpty(field.value);
        this.setState(Stage.Basic.Form.fieldNameValue(field));

        let param = this._mapFieldToParam(field.name, field.value);
        this.props.toolbox.refresh(param);
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
            params = Object.assign(params, this._mapFieldToParam(key,value));
        });

        this.props.toolbox.refresh(params);
    }

    render () {
        let {Form, Button, Icon} = Stage.Basic;

        let blueprints = Object.assign({}, {items:[]}, this.props.blueprints);
        let blueprintOptions = _.map(blueprints.items, item => { return {text: item.id, value: item.id} });

        let deployments = Object.assign({}, {items:[]}, this.props.deployments);
        let deploymentOptions = _.map(deployments.items, item => { return {text: item.id, value: item.id} });

        //How to fetch all event types? Hopefully not from /events API
        let typeOptions = _.map(['?'], item => { return {text: item.id, value: item.id} });

        return (
            <Form size="small">
                <Form.Group inline widths="4">
                    <Form.Field>
                        <Form.Dropdown placeholder='Blueprints' fluid multiple search selection options={blueprintOptions}
                                       name="blueprint_id" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.blueprint_id} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Deployments' fluid multiple search selection options={deploymentOptions}
                                       name="deployment_id" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.deployment_id} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Dropdown placeholder='Event Types' fluid multiple search selection options={typeOptions}
                                       name="event_type" renderLabel={this._renderLabel.bind(this)} closeOnChange
                                       value={this.state.event_type} onChange={this._handleInputChange.bind(this)}/>
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
                        <Form.InputDate placeholder='Time Start' name="time_start"
                                        value={this.state.time_start} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.InputDate placeholder='Time End' name="time_end"
                                        value={this.state.time_end} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Input placeholder='Message Text' fluid name="message_text"
                                    value={this.state.message_text} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}