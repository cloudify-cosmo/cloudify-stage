/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, show: false}
    }

    static initialState = {
        loading: false,
        secretKey: '',
        secretValue: '',
        errors: {}
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired
    };

    onApprove () {
        this.refs.createForm.submit();
        return false;
    }

    onDeny () {
        this.setState({show: false});
        return true;
    }

    _showModal() {
        this.setState({show: true});
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state.show && prevState.show != this.state.show) {
            this.setState(CreateModal.initialState);
        }
    }

    _createSecret() {
        let errors = {};

        if (_.isEmpty(this.state.secretKey)) {
            errors['secretKey'] = 'Please provide secret key';
        }

        if (_.isEmpty(this.state.secretValue)) {
            errors['secretValue'] = 'Please provide secret value';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        let actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.secretKey, this.state.secretValue).then(()=>{
            this.setState({loading: false, show: false});
            this.props.toolbox.refresh();
        }).catch((err)=> {
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, Button, Icon, Form} = Stage.Basic;

        return (
            <div>
                <Button content='Create' icon='add' labelPosition='left' onClick={this._showModal.bind(this)} />

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <Icon name='add' /> Create secret
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._createSecret.bind(this)} errors={this.state.errors} ref='createForm'>
                            <Form.Field error={this.state.errors.secretKey}>
                                <Form.Input name='secretKey' placeholder='Secret key'
                                            value={this.state.secretKey} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                            <Form.Field error={this.state.errors.secretValue}>
                                <Form.Input name='secretValue' placeholder='Secret value'
                                            value={this.state.secretValue} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Create" icon='add' className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
