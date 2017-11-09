/**
 * Created by jakubniezgoda on 08/11/17.
 */

export default class RequestServiceDemo extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.methods = [
            {text: 'GET', value: 'get', key: 'get', func: 'doGet'},
            {text: 'POST', value: 'post', key: 'post', func: 'doPost'},
            {text: 'PATCH', value: 'patch', key: 'patch', func: 'doPatch'},
            {text: 'DELETE', value: 'delete', key: 'delete', func: 'doDelete'},
        ];

        this.state = {
            method: this.methods[0].value,
            url: '',
            data: '',
            error: '',
            loading: false
        }

    }

    _onChange(event, field) {
        this.setState({[field.name]: field.value})
    }

    _onClick() {
        this.state.data = null;
        const REQUEST_SERVICE_NAME = 'request';
        let method = _.find(this.methods, (method) => method.value === this.state.method);

        this.setState({loading: true})
        this.props.widgetBackend[method.func](REQUEST_SERVICE_NAME, {url: this.state.url})
            .then((data) => {
                this.setState({data, error: '', loading: false})
            })
            .catch((error) => {
                this.setState({data: '', error, loading: false})
            });
    }

    render() {
        var {Button, ErrorMessage, Form, HighlightText, Label, Loading, Segment} = Stage.Basic;


        return (
            <div>
                <Segment padded>
                    <Label attached='top'>Request</Label>
                    <Form onSubmit={this._onClick.bind(this)}>
                        <Form.Group inline>
                            <Form.Field>
                                <Form.Dropdown value={this.state.method} name="method" label='Method' selection closeOnChange
                                               onChange={this._onChange.bind(this)} options={this.methods} />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input value={this.state.url} name="url" label='URL'
                                            onChange={this._onChange.bind(this)} />
                            </Form.Field>
                            <Form.Field>
                                <Form.Button content='Fire' icon='rocket' disabled={_.isEmpty(this.state.url)}
                                             onClick={this._onClick.bind(this)} />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Segment>
                <Segment padded>
                    <Label attached='top'>Response</Label>
                    {
                        this.state.loading
                            ? <Loading />
                            : _.isEmpty(this.state.error)
                                ? <HighlightText>{this.state.data}</HighlightText>
                                : <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: ''})} />
                    }
                </Segment>
            </div>
        );
    }
}

