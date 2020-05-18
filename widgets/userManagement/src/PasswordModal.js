/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class PasswordModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = PasswordModal.initialState;
    }

    static initialState = {
        loading: false,
        password: '',
        confirmPassword: '',
        errors: {}
    };

    onApprove() {
        this.submitPassword();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { open } = this.props;
        if (!prevProps.open && open) {
            this.setState(PasswordModal.initialState);
        }
    }

    submitPassword() {
        const { confirmPassword, password } = this.state;
        const { onHide, toolbox, user } = this.props;
        const errors = {};

        if (_.isEmpty(password)) {
            errors.password = 'Please provide user password';
        }

        if (_.isEmpty(confirmPassword)) {
            errors.confirmPassword = 'Please provide password confirmation';
        }

        if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(toolbox);
        actions
            .doSetPassword(user.username, password)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { confirmPassword, errors, loading, password } = this.state;
        const { onHide, open, user: userProp } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const user = { username: '', ...userProp };

        return (
            <Modal open={open} onClose={() => onHide()} className="userPasswordModal">
                <Modal.Header>
                    <Icon name="lock" /> Set password for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.password}>
                            <Form.Input
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field error={errors.confirmPassword}>
                            <Form.Input
                                name="confirmPassword"
                                placeholder="Confirm password"
                                type="password"
                                value={confirmPassword}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={loading} icon="lock" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
}
