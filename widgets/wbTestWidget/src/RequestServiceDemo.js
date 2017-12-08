/**
 * Created by jakubniezgoda on 08/11/17.
 */

export default class RequestServiceDemo extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.methods = [
            {text: 'GET', value: 'get', key: 'get', func: 'doGet'},
            {text: 'POST', value: 'post', key: 'post', func: 'doPost'},
            {text: 'PUT', value: 'put', key: 'put', func: 'doPut'},
            {text: 'DELETE', value: 'delete', key: 'delete', func: 'doDelete'},
        ];

        this.requestServiceName = 'request';

        this.state = {
            method: this.methods[0].value,
            url: '',
            params: {},
            paramsCount: 0,
            payload: '',
            data: '',
            error: '',
            loading: false
        }
    }

    _onChange(event, field) {
        this.setState({[field.name]: field.value})
    }

    _onClick() {
        let method = _.find(this.methods, (method) => method.value === this.state.method);

        let params = {};
        for (var i = 0; i < this.state.paramsCount; i++) {
            if (this.state.params[i] && this.state.params[i].name) {
                params[this.state.params[i].name] = this.state.params[i].value;
            }
        }

        let url = this.state.url;

        let payload = true; // in case of doGet this value is sent as parseResponse argument
        if (!_.isEqual(this.state.method, this.methods[0].value) && !_.isEmpty(this.state.payload)){
            try {
                payload = JSON.parse(this.state.payload);
            } catch (error) {
                this.setState({error: 'Cannot parse payload. Error: ' + error});
                return;
            }
        }


        this.setState({loading: true})
        this.props.widgetBackend[method.func](this.requestServiceName, {url, ...params}, payload)
            .then((data) => {
                this.setState({data, error: '', loading: false})
            })
            .catch((error) => {
                this.setState({data: '', error, loading: false})
            });
    }

    render() {
        var {Button, Dropdown, ErrorMessage, Form, Input, HighlightText, Label, Loading, Popup, Segment, Table} = Stage.Basic;
        var isGetMethodSelected = _.isEqual(this.state.method, this.methods[0].value);
        var data = this.state.data;

        return (
            <div>
                <Segment padded>
                    <Label attached='top'>Request</Label>
                    <Table compact basic='very'>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Dropdown value={this.state.method} name="method" label='Method' selection closeOnChange compact
                                              onChange={this._onChange.bind(this)} options={this.methods} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Popup>
                                        <Popup.Trigger>
                                            <Input value={this.state.url} name="url" label='URL' fluid
                                                   onChange={this._onChange.bind(this)} />
                                        </Popup.Trigger>
                                        You can use any HTTP URL here.
                                    </Popup>
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <Button content='Fire' icon='rocket' disabled={_.isEmpty(this.state.url)}
                                            onClick={this._onClick.bind(this)} />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Segment padded>
                        <Label attached='top'>Parameters</Label>
                        <Table>
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                    <Form>
                                        <Form.Table name="params" value={this.state.params} onChange={this._onChange.bind(this)}
                                                    columns={[
                                                        {name: 'name', label: 'Name', default: '', type: Stage.Basic.GenericField.STRING_TYPE},
                                                        {name: 'value', label: 'Value', default: '', type: Stage.Basic.GenericField.STRING_TYPE}
                                                    ]}
                                                    rows={this.state.paramsCount} />
                                    </Form>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button icon='add' onClick={() => this.setState({paramsCount: this.state.paramsCount + 1})} />
                                    <Button icon='minus' disabled={this.state.paramsCount === 0} onClick={() => this.setState({paramsCount: this.state.paramsCount - 1})} />
                                </Table.Cell>
                            </Table.Row>
                        </Table>
                    </Segment>
                    {
                        !isGetMethodSelected &&
                        <Segment padded>
                            <Label attached='top'>Payload</Label>
                            <Form>
                                <Form.TextArea value={this.state.payload} name="payload" rows={3}
                                               onChange={this._onChange.bind(this)}  />
                            </Form>
                        </Segment>
                    }
                </Segment>
                <Segment padded>
                    <Label attached='top'>Response</Label>
                    {
                        this.state.loading
                            ? <Loading />
                            : _.isEmpty(this.state.error)
                                ? <HighlightText>{_.isObject(data) ? JSON.stringify(data, null, 2) : data}</HighlightText>
                                : <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: ''})} />
                    }
                </Segment>
            </div>
        );
    }
}

