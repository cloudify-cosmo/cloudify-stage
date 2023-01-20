import { isEmpty } from 'lodash';
import { useState } from 'react';
import type { Secret } from 'app/widgets/common/secrets/SecretActions';
import type { SecretProvidersWidget } from '../../secretProviders/src/widget.types';
import { translateForm } from './widget.utils';

const { Modal, Icon, Form, ApproveButton, CancelButton, ErrorMessage } = Stage.Basic;
const { MultilineInput } = Stage.Common.Secrets;

interface UpdateModalProps {
    open: boolean;
    secret: Secret;
    toolbox: Stage.Types.Toolbox;
    onHide: () => void;
}

const translateUpdateModal = Stage.Utils.getT('widgets.secrets.updateModal');

export default function UpdateModal({ open, secret, toolbox, onHide }: UpdateModalProps) {
    const { useBoolean, useErrors, useOpenProp, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [canUpdateSecret, enableSecretUpdate, disableSecretUpdate] = useBoolean(true);
    const [secretValue, setSecretValue, clearSecretValue] = useInput('');
    const [useSecretProvider, setUseSecretProvider] = useState(secret.provider_name !== null);
    const [secretProvider, setSecretProvider, clearSecretProvider] = useInput('');
    const [secretProviderPath, setSecretProviderPath, clearSecretProviderPath] = useInput('');
    const [secretProviders, setSecretProviders] = useState<SecretProvidersWidget.DataItem[]>();
    const [secretProviderOptions, setSecretProviderOptions] = useState<Record<string, any>>();

    useOpenProp(open, () => {
        setLoading();
        enableSecretUpdate();
        clearErrors();
        clearSecretValue();
        clearSecretProvider();
        clearSecretProviderPath();
        fetchSecretProviders();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doGetAllSecrets()
            .then(data => {
                const secretData = data.items.find((item: Secret) => item.key === secret.key);
                const hasSecretProvider = !isEmpty(secret.provider_name);
                if (secretData) {
                    const isHidden = secretData.is_hidden_data;
                    if (hasSecretProvider) {
                        setUseSecretProvider(true);
                        setSecretProvider(secretData.provider_name);
                        actions.doGet(secretData.key).then(({ provider_options: providerOptions }) => {
                            setSecretProviderOptions(providerOptions);
                            setSecretProviderPath(providerOptions!.path);
                        });
                    } else {
                        setUseSecretProvider(false);
                        actions
                            .doGet(secretData.key)
                            .then(({ value }) => {
                                setSecretValue(value);
                            })
                            .catch(err => setErrors({ error: err.message }));
                    }

                    if (isHidden) {
                        disableSecretUpdate();
                    } else {
                        enableSecretUpdate();
                    }
                }
            })
            .catch(err => setErrors({ error: err.message }))
            .finally(unsetLoading);
    });

    function updateSecret() {
        clearErrors();
        if (isEmpty(secretValue) && !useSecretProvider) {
            setErrors({ secretValue: translateForm('errors.validation.secretValue') });
            return;
        }
        if (isEmpty(secretProvider) && useSecretProvider) {
            setErrors({ secretProvider: translateForm('errors.validation.secretProvider') });
            return;
        }

        if (!isEmpty(errors)) {
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doUpdate(secret.key, secretValue, secretProvider, secretProviderOptions)
            .then(() => {
                clearErrors();
                onHide();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function fetchSecretProviders() {
        const secretActions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        secretActions
            .doGetAllSecretProviders()
            .then(data => setSecretProviders(data.items))
            .catch(setMessageAsError);
    }

    function onSecretProviderChange() {
        // clearErrors();
        if (errors.secretValue) {
            setErrors({ ...errors, secretValue: null });
        }
        if (isEmpty(secretProviders)) {
            setErrors({ ...errors, secretProviderCheckbox: translateForm('errors.validation.noProviders') });
            return;
        }
        setUseSecretProvider(!useSecretProvider);
    }

    const currentUsername = toolbox.getManager().getCurrentUsername();
    const selectedTenant = toolbox.getManager().getSelectedTenant();

    const headerContent = translateUpdateModal('header', { secretKey: secret.key });

    const noPermissionError = translateForm('errors.noPermission', {
        currentUsername,
        secretKey: secret.key,
        selectedTenant
    });

    const secretProvidersDropdownOptions = secretProviders?.map((item: { name: string }) => ({
        text: item.name,
        value: item.name
    }));

    return (
        <div>
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="edit" /> {headerContent}
                </Modal.Header>

                <Modal.Content>
                    {!canUpdateSecret && <ErrorMessage error={noPermissionError} />}
                    <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                        {canUpdateSecret && (
                            <>
                                <Form.Field>
                                    <Form.Checkbox
                                        label={translateForm('inputs.useSecretProvider.label')}
                                        name="useSecretProvider"
                                        checked={useSecretProvider && !isEmpty(secretProviders)}
                                        onChange={onSecretProviderChange}
                                        disabled={isEmpty(secretProviders)}
                                        help={
                                            isEmpty(secretProviders)
                                                ? translateForm('errors.validation.noProviders')
                                                : null
                                        }
                                    />
                                </Form.Field>
                                {useSecretProvider ? (
                                    <>
                                        <Form.Field
                                            label={translateForm('inputs.secretProvider.label')}
                                            error={errors.secretProvider}
                                            required
                                        >
                                            <Form.Dropdown
                                                name="secretProvider"
                                                placeholder={translateForm('inputs.secretProvider.placeholder')}
                                                selection
                                                options={secretProvidersDropdownOptions}
                                                value={secretProvider}
                                                onChange={setSecretProvider}
                                            />
                                        </Form.Field>
                                        <Form.Field
                                            label={translateForm('inputs.secretProviderPath.label')}
                                            error={errors.secretProviderPath}
                                            required
                                        >
                                            <Form.Input
                                                name="secretProviderPath"
                                                placeholder={translateForm('inputs.secretProviderPath.placeholder')}
                                                value={secretProviderPath}
                                                onChange={setSecretProviderPath}
                                            />
                                        </Form.Field>
                                    </>
                                ) : (
                                    <Form.Field error={errors.secretValue}>
                                        <MultilineInput
                                            name="secretValue"
                                            placeholder={translateForm('inputs.secretValue.placeholder')}
                                            value={secretValue}
                                            onChange={setSecretValue}
                                        />
                                    </Form.Field>
                                )}
                            </>
                        )}
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={isLoading} />
                    {canUpdateSecret && (
                        <ApproveButton
                            onClick={updateSecret}
                            disabled={isLoading}
                            content={translateUpdateModal('buttons.update')}
                            icon="edit"
                        />
                    )}
                </Modal.Actions>
            </Modal>
        </div>
    );
}
