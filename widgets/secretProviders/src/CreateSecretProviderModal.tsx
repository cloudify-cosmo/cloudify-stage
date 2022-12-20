import type { EventBus, Manager } from 'cloudify-ui-components/toolbox';
import { isEmpty } from 'lodash';
import { tableRefreshEvent } from './widget.consts';
import { translateSecretProviders } from './widget.utils';
import type { SecretProvidersType } from './widget.types';

const { useInput, useErrors } = Stage.Hooks;
const { Modal, Button, Form } = Stage.Basic;

interface CreateSecretProviderModalProps {
    onClose: () => void;
    toolbox: Stage.Types.Toolbox;
    manager: Manager;
    eventBus: EventBus;
    secretProviderType: SecretProvidersType | null;
}

const CreateSecretProviderModal = ({
    onClose,
    toolbox,
    manager,
    eventBus,
    secretProviderType
}: CreateSecretProviderModalProps) => {
    const { errors, setErrors, clearErrors } = useErrors();
    const [providerName, setProviderName] = useInput('');
    const [hostname, setHostname] = useInput('');
    const [authorizationToken, setAuthorizationToken] = useInput('');
    const [defaultPath, setDefaultPath] = useInput('');

    const translateCreateModal = Stage.Utils.composeT(translateSecretProviders, 'createModal');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!providerName) {
            newErrors.providerName = translateCreateModal('errors.providerName.required');
        } else if (!Stage.Common.Consts.idRegex.test(providerName)) {
            newErrors.providerName = translateCreateModal('errors.providerName.invalid');
        }

        if (!hostname) {
            newErrors.hostname = translateCreateModal('errors.hostname');
        }

        if (!authorizationToken) {
            newErrors.authorizationToken = translateCreateModal('errors.authorizationToken');
        }

        setErrors(newErrors);

        return isEmpty(newErrors);
    };

    const handleSubmit = () => {
        clearErrors();

        if (!validateForm()) {
            return;
        }

        manager
            .doPut('/secrets-providers', {
                body: {
                    name: providerName,
                    host: hostname,
                    token: authorizationToken,
                    path: defaultPath,
                    type: secretProviderType
                }
            })
            .then(() => {
                toolbox.refresh();
                eventBus.trigger(tableRefreshEvent);
                onClose();
            })
            .catch(() => {
                setErrors({ error: translateCreateModal('errors.createError') });
            });
    };

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>{translateCreateModal('header')}</Modal.Header>
            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={translateCreateModal('inputs.providerName.label')}
                        required
                        error={errors.providerName}
                    >
                        <Form.Input
                            value={providerName}
                            onChange={setProviderName}
                            name="providerName"
                            placeholder={translateCreateModal('inputs.providerName.placeholder')}
                            required
                        />
                    </Form.Field>
                    <Form.Field label={translateCreateModal('inputs.hostname.label')} required error={errors.hostname}>
                        <Form.Input
                            value={hostname}
                            onChange={setHostname}
                            name="hostname"
                            placeholder={translateCreateModal('inputs.hostname.placeholder')}
                        />
                    </Form.Field>
                    <Form.Field
                        label={translateCreateModal('inputs.authorizationToken.label')}
                        required
                        error={errors.authorizationToken}
                    >
                        <Form.Input
                            value={authorizationToken}
                            onChange={setAuthorizationToken}
                            name="authorizationToken"
                            placeholder={translateCreateModal('inputs.authorizationToken.placeholder')}
                        />
                    </Form.Field>
                    <Form.Field label={translateCreateModal('inputs.defaultPath.label')}>
                        <Form.Input
                            value={defaultPath}
                            onChange={setDefaultPath}
                            name="defaultPath"
                            placeholder={translateCreateModal('inputs.defaultPath.placeholder')}
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
