/**
 * Created by Alex Laktionow on 9/14/17.
 */

export default class CreateControls extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            key: '',
            value: ''
        }
    }

    _create() {
        this.props.onCreate(this.state.key, this.state.value);
        this.setState({key: '', value: ''});
    }

    _onChange(event, field) {
        this.setState({[field.name]: field.value})
    }

    render() {
        var {Form} = Stage.Basic;

        return (
            <Form>
                <Form.Group inline widths="equal">
                    <Form.Field>
                        <Form.Input fluid value={this.state.key} name="key" label='Key' onChange={this._onChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Input fluid value={this.state.value} name="value" label='Value' onChange={this._onChange.bind(this)}/>
                    </Form.Field>
                    <Form.Field>
                        <Form.Button fluid icon="plus" floated="right" content="Add" onClick={this._create.bind(this)}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

