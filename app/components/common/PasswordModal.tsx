import _ from 'lodash';
import React, { useEffect } from 'react';
import i18n from 'i18next';
import { useSelector } from 'react-redux';
import Manager from '../../utils/Manager';
import { useBoolean, useErrors, useResettableState } from '../../utils/hooks';
import { ApproveButton, CancelButton, Form, Icon, Modal } from '../basic';
import type { ReduxState } from '../../reducers';

interface PasswordModalProps {
    onHide: () => void;
    open: boolean;
    username?: string;
}

const PasswordModal: React.FunctionComponent<PasswordModalProps> = ({ onHide, open, username }) => {
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [password, setPassword, resetPassword] = useResettableState('');
    const [confirmPassword, setConfirmPassword, resetConfirmPassword] = useResettableState('');
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const manager = useSelector((state: ReduxState) => new Manager(state.manager));
    const loggedInUsername = useSelector((state: ReduxState) => state.manager.auth.username);

    useEffect(() => {
        if (open) {
            unsetLoading();
            resetPassword();
            resetConfirmPassword();
            clearErrors();
        }
    }, [open]);

    const submitPassword = () => {
        const errorsFound: { password?: string; confirmPassword?: string } = {};

        if (_.isEmpty(password)) {
            errorsFound.password = i18n.t('users.changePasswordModal.errors.noPassword');
        }

        if (_.isEmpty(confirmPassword)) {
            errorsFound.confirmPassword = i18n.t('users.changePasswordModal.errors.noPasswordConfirmation');
        }

        if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
            errorsFound.confirmPassword = i18n.t('users.changePasswordModal.errors.passwordsMismatch');
        }

        if (!_.isEmpty(errorsFound)) {
            setErrors(errorsFound);
            return false;
        }

        // Disable the form
        setLoading();

        return manager
            .doPost(`/users/${username || loggedInUsername}`, { body: { password } })
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
                <Icon name="lock" />
                {i18n.t('users.changePasswordModal.header', {
                    username: username || loggedInUsername
                })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={i18n.t('users.changePasswordModal.password')} error={errors.password} required>
                        <Form.Input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(_event, { value }) => setPassword(value)}
                        />
                    </Form.Field>

                    <Form.Field
                        label={i18n.t('users.changePasswordModal.passwordConfirm')}
                        error={errors.confirmPassword}
                        required
                    >
                        <Form.Input
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(_event, { value }) => setConfirmPassword(value)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onCancel} disabled={loading} />
                <ApproveButton
                    onClick={onApprove}
                    disabled={loading}
                    content={i18n.t('users.changePasswordModal.change')}
                    icon="lock"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default PasswordModal;
