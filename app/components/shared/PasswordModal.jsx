import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Manager from '../../utils/Manager';
import { useBoolean, useErrors, useResettableState } from '../../utils/hooks';
import { Modal, Icon, Form, ApproveButton, CancelButton } from '../basic';

function PasswordModal({ onHide, open, manager, username }) {
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [password, setPassword, resetPassword] = useResettableState('');
    const [confirmPassword, setConfirmPassword, resetConfirmPassword] = useResettableState('');
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    useEffect(() => {
        if (open) {
            unsetLoading();
            resetPassword();
            resetConfirmPassword();
            clearErrors();
        }
    }, [open]);

    const submitPassword = () => {
        const errorsFound = {};

        if (_.isEmpty(password)) {
            errorsFound.password = 'Please provide user password';
        }

        if (_.isEmpty(confirmPassword)) {
            errorsFound.confirmPassword = 'Please provide password confirmation';
        }

        if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
            errorsFound.confirmPassword = 'Passwords do not match';
        }

        if (!_.isEmpty(errorsFound)) {
            setErrors(errorsFound);
            return false;
        }

        // Disable the form
        setLoading();

        return manager
            .doPost(`/users/${username}`, null, { password })
            .then(() => {
                clearErrors();
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    };

    const onApprove = () => {
        submitPassword();
        return false;
    };

    const onCancel = () => {
        onHide();
        return true;
    };

    return (
        <Modal open={open} onClose={() => onHide()} className="userPasswordModal">
            <Modal.Header>
                <Icon name="lock" /> Change password for {username}
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label="Password" error={errors.password} required>
                        <Form.Input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(event, { value }) => setPassword(value)}
                        />
                    </Form.Field>

                    <Form.Field label="Confirm password" error={errors.confirmPassword} required>
                        <Form.Input
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event, { value }) => setConfirmPassword(value)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onCancel} disabled={loading} />
                <ApproveButton onClick={onApprove} disabled={loading} content="Change" icon="lock" color="green" />
            </Modal.Actions>
        </Modal>
    );
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
