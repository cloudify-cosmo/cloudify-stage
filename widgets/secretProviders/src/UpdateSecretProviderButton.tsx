import { isEmpty } from 'lodash';
import type { Manager } from 'cloudify-ui-components/toolbox';
import { translateSecretProviders, validateModalForm } from './widget.utils';
import type { SecretProvidersWidget } from './widget.types';

const { Icon, Modal, Button, Form } = Stage.Basic;

const { useBoolean, useErrors, useInput } = Stage.Hooks;

interface UpdateSecretProviderButtonProps {
    secretProvider: SecretProvidersWidget.DataItem;
    manager: Manager;
    onSubmit: () => void;
}

const translateUpdateModal = Stage.Utils.composeT(translateSecretProviders, 'updateModal');
const translateForm = Stage.Utils.composeT(translateSecretProviders, 'form');

const UpdateSecretProviderButton = ({ secretProvider, manager, onSubmit }: UpdateSecretProviderButtonProps) => {
    const { errors, setErrors, clearErrors } = useErrors();

    const [hostname, setHostname] = useInput(secretProvider?.connection_parameters?.host ?? '');
    const [authorizationToken, setAuthorizationToken] = useInput(secretProvider?.connection_parameters?.token ?? '');
    const [defaultPath, setDefaultPath] = useInput(secretProvider?.connection_parameters?.path ?? '');

    const [isUpdateModalOpen, openUpdateModal, closeUpdateModal] = useBoolean();

    const formValues = { hostname, authorizationToken };

    const checkForm = () => {
        const newErrors = validateModalForm(formValues, false);
        setErrors(newErrors);
        return isEmpty(newErrors);
    };

    const updateSecretProvider = () => {
        clearErrors();

        if (!checkForm()) {
            return;
        }
        manager
            .doPatch(`/secrets-providers/${secretProvider.id}`, {
                body: {
                    connection_parameters: {
                        host: hostname,
                        token: authorizationToken,
                        path: defaultPath
                    }
                }
            })
            .then(() => {
                onSubmit();
                closeUpdateModal();
            })
            .catch(err => {
                log.error(err);
                setErrors({ error: translateForm('errors.update') });
            });
    };

    const UpdateSecretProviderModal = (
        <Modal open onClose={closeUpdateModal}>
            <Modal.Header>{translateUpdateModal('header')}</Modal.Header>
            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={translateForm('inputs.hostname.label')} required error={errors.hostname}>
                        <Form.Input
                            value={hostname}
                            onChange={setHostname}
                            name="hostname"
                            placeholder={translateForm('inputs.hostname.placeholder')}
                        />
                    </Form.Field>
                    <Form.Field
                        label={translateForm('inputs.authorizationToken.label')}
                        required
                        error={errors.authorizationToken}
                    >
                        <Form.Input
                            value={authorizationToken}
                            onChange={setAuthorizationToken}
                            name="authorizationToken"
                            placeholder={translateForm('inputs.authorizationToken.placeholder')}
                        />
                    </Form.Field>
                    <Form.Field label={translateForm('inputs.defaultPath.label')}>
                        <Form.Input
                            value={defaultPath}
                            onChange={setDefaultPath}
                            name="defaultPath"
                            placeholder={translateForm('inputs.defaultPath.placeholder')}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button content={translateUpdateModal('buttons.cancel')} onClick={closeUpdateModal} />
                <Button content={translateUpdateModal('buttons.update')} onClick={updateSecretProvider} primary />
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            <Icon
                link
                name="edit"
                title={translateSecretProviders('table.buttons.updateSecretProvider')}
                onClick={openUpdateModal}
            />
            {isUpdateModalOpen && UpdateSecretProviderModal}
        </>
    );
};

export default UpdateSecretProviderButton;
