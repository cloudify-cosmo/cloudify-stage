import { isEmpty } from 'lodash';
import type { Manager } from 'cloudify-ui-components/toolbox';
import { translateSecretProviders, translateForm, validateModalForm } from './widget.utils';
import type { VaultConnectionParameters, SecretProvidersWidget } from './widget.types';

const { useErrors, useInput } = Stage.Hooks;
const { Modal, Button, Form } = Stage.Basic;

interface UpdateSecretProviderModalProps {
    onClose: () => void;
    onSubmit: () => void;
    manager: Manager;
    secretProvider: SecretProvidersWidget.DataItem;
}
const translateUpdateModal = Stage.Utils.composeT(translateSecretProviders, 'updateModal');

const UpdateSecretProviderModal = ({ onClose, onSubmit, manager, secretProvider }: UpdateSecretProviderModalProps) => {
    const { errors, setErrors, clearErrors } = useErrors();
    const connectionParameters = secretProvider?.connection_parameters;

    const [url, setUrl] = useInput(connectionParameters?.url ?? '');
    const [authorizationToken, setAuthorizationToken] = useInput(connectionParameters?.token ?? '');
    const [defaultPath, setDefaultPath] = useInput(connectionParameters?.path ?? '');

    const formValues = { url, authorizationToken };

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
            .doPatch<VaultConnectionParameters>(`/secrets-providers/${secretProvider.id}`, {
                body: {
                    connection_parameters: {
                        url,
                        token: authorizationToken,
                        path: defaultPath
                    }
                }
            })
            .then(() => {
                onSubmit();
                onClose();
            })
            .catch(err => {
                log.error(err);
                setErrors({ error: translateForm('errors.update') });
            });
    };
    return (
        <Modal open onClose={onClose}>
            <Modal.Header>{translateUpdateModal('header')}</Modal.Header>
            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={translateForm('inputs.url.label')}
                        required
                        error={errors.url}
                        help={translateForm('inputs.url.helper')}
                    >
                        <Form.Input
                            value={url}
                            onChange={setUrl}
                            name="url"
                            placeholder={translateForm('inputs.url.placeholder')}
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
                <Button content={translateUpdateModal('buttons.cancel')} onClick={onClose} />
                <Button content={translateUpdateModal('buttons.update')} onClick={updateSecretProvider} primary />
            </Modal.Actions>
        </Modal>
    );
};

export default UpdateSecretProviderModal;
