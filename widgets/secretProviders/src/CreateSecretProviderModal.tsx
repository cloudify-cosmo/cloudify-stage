import type { Manager } from 'cloudify-ui-components/toolbox';
import { isEmpty } from 'lodash';
import { translateSecretProviders, translateForm, validateModalForm } from './widget.utils';
import type { SecretProvidersType } from './widget.types';

const { useInput, useErrors } = Stage.Hooks;
const { Modal, Button, Form } = Stage.Basic;

interface CreateSecretProviderModalProps {
    onClose: () => void;
    onSubmit: () => void;
    manager: Manager;
    secretProviderType: SecretProvidersType;
}

const CreateSecretProviderModal = ({
    onClose,
    onSubmit,
    manager,
    secretProviderType
}: CreateSecretProviderModalProps) => {
    const { errors, setErrors, clearErrors } = useErrors();
    const [providerName, setProviderName] = useInput('');
    const [hostname, setHostname] = useInput('');
    const [authorizationToken, setAuthorizationToken] = useInput('');
    const [defaultPath, setDefaultPath] = useInput('');

    const translateCreateModal = Stage.Utils.composeT(translateSecretProviders, 'createModal');

    const formValues = { providerName, hostname, authorizationToken, defaultPath };

    const checkForm = () => {
        const newErrors = validateModalForm(formValues, true);
        setErrors(newErrors);
        return isEmpty(newErrors);
    };

    const handleSubmit = () => {
        clearErrors();

        if (!checkForm()) {
            return;
        }

        manager
            .doPut('/secrets-providers', {
                body: {
                    name: providerName,
                    connection_parameters: {
                        url: hostname,
                        token: authorizationToken,
                        path: defaultPath
                    },
                    type: secretProviderType
                }
            })
            .then(() => {
                onSubmit();
                onClose();
            })
            .catch(() => {
                setErrors({ error: translateForm('errors.create') });
            });
    };

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>{translateCreateModal('header')}</Modal.Header>
            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={translateForm('inputs.providerName.label')} required error={errors.providerName}>
                        <Form.Input
                            value={providerName}
                            onChange={setProviderName}
                            name="providerName"
                            placeholder={translateForm('inputs.providerName.placeholder')}
                            required
                        />
                    </Form.Field>
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
                <Button content={translateCreateModal('buttons.cancel')} onClick={onClose} />
                <Button content={translateCreateModal('buttons.create')} onClick={handleSubmit} primary />
            </Modal.Actions>
        </Modal>
    );
};

export default CreateSecretProviderModal;
