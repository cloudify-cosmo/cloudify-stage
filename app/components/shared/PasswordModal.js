import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

import Manager from '../../utils/Manager';
import { Modal, Icon, Form, ApproveButton, CancelButton } from '../basic';

class PasswordModal extends Component {
    static initialState = {
        loading: false,
        password: '',
        confirmPassword: '',
        errors: {}
    };

    constructor(props, context) {
        super(props, context);

        this.state = PasswordModal.initialState;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onApprove = this.onApprove.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { open } = this.props;
        if (!prevProps.open && open) {
            this.setState(PasswordModal.initialState);
        }
    }

    onApprove() {
        this.submitPassword();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    submitPassword() {
        const { confirmPassword, password } = this.state;
        const { onHide, manager, username } = this.props;
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

        return manager
            .doPost(`/users/${username}`, null, { password })
            .then(() => {
                this.setState({ errors: {}, loading: false });
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    render() {
        const { confirmPassword, errors, loading, password } = this.state;
        const { onHide, open, username } = this.props;

        return (
            <Modal open={open} onClose={() => onHide()} className="userPasswordModal">
                <Modal.Header>
                    <Icon name="lock" /> Change password for {username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field label="Password" error={errors.password} required>
                            <Form.Input
                                name="password"
                                type="password"
                                value={password}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field label="Confirm password" error={errors.confirmPassword} required>
                            <Form.Input
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove}
                        disabled={loading}
                        content="Change"
                        icon="lock"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

PasswordModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    manager: PropTypes.shape({ doPost: PropTypes.func.isRequired }).isRequired,
    username: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        manager: new Manager(state.manager),
        username: ownProps.username || state.manager.username
    };
};

export default connect(mapStateToProps)(PasswordModal);
