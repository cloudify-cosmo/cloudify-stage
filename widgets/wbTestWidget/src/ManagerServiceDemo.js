/**
 * Created by jakubniezgoda on 09/11/17.
 */

export default class ManagerServiceDemo extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.methods = [
            {text: 'GET', value: 'get', key: 'get', func: 'doGet'},
            {text: 'POST', value: 'post', key: 'post', func: 'doPost'},
            {text: 'PUT', value: 'put', key: 'put', func: 'doPut'},
            {text: 'PATCH', value: 'patch', key: 'patch', func: 'doPatch'},
            {text: 'DELETE', value: 'delete', key: 'delete', func: 'doDelete'},
        ];

        this.managerServiceName = 'manager';

        this.state = {
            method: this.methods[0].value,
            endpoint: '',
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
        this.setState({loading: true})
        this.props.widgetBackend[method.func](this.managerServiceName, {
                endpoint: this.state.endpoint,
                payload: this.state.payload
            }).then((data) => {
                this.setState({data, error: '', loading: false})
            }).catch((error) => {
                this.setState({data: '', error: error.status + ' - ' + error.message, loading: false})
            });
    }

    render() {
        var {Button, Dropdown, ErrorMessage, Form, Input, HighlightText, Label, Loading, Popup, Segment, Table} = Stage.Basic;


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
                                            <Input value={this.state.endpoint} name="endpoint" label='http://<manager-ip>/api/v3.1/'
                                                   onChange={this._onChange.bind(this)} fluid placeholder='Cloudify REST API endpoint'/>
                                        </Popup.Trigger>
                                        See Cloudify REST API documentation for details about possible endpoints.
                                    </Popup>
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <Button content='Fire' icon='rocket' disabled={_.isEmpty(this.state.endpoint)}
                                            onClick={this._onClick.bind(this)} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='3'>
                                    <Form>
                                        <Form.TextArea value={this.state.payload} name="payload" rows={3}
                                                       onChange={this._onChange.bind(this)} placeholder='JSON payload'/>
                                    </Form>

                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
                <Segment padded>
                    <Label attached='top'>Response</Label>
                    {
                        this.state.loading
                            ? <Loading />
                            : _.isEmpty(this.state.error)
                                ? <HighlightText>{JSON.stringify(this.state.data, null, 2)}</HighlightText>
                                : <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: ''})} />
                    }
                </Segment>
            </div>
        );
    }
}

