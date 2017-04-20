/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class PasswordModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = PasswordModal.initialState;
    }

    static initialState = {
        loading: false,
        password: "",
        confirmPassword: "",
        errors: {}
    }

    onApprove () {
        this._submitPassword();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(PasswordModal.initialState);
        }
    }

    _submitPassword() {
        let errors = {};

        if (_.isEmpty(this.state.password)) {
            errors["password"]="Please provide user password";
        }

        if (_.isEmpty(this.state.confirmPassword)) {
            errors["confirmPassword"]="Please provide password confirmation";
        }

        if (!_.isEmpty(this.state.password) && !_.isEmpty(this.state.confirmPassword) &&
            this.state.password !== this.state.confirmPassword) {
            errors["confirmPassword"]="Passwords do not match";
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doSetPassword(this.props.user.username, this.state.password).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var user = Object.assign({},{username:""}, this.props.user);

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                    <Icon name="lock"/> Set password for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field error={this.state.errors.password}>
                            <Form.Input name='password' placeholder="Password" type="password"
                                        value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.confirmPassword}>
                            <Form.Input name='confirmPassword' placeholder="Confirm password" type="password"
                                        value={this.state.confirmPassword} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="lock" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
