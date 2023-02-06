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
    const [useSecretProvider, setUseSecretProvider, unsetUseSecretProvider] = useBoolean();
    const [secretProvider, setSecretProvider, clearSecretProvider] = useInput('');
    const [secretProviderPath, setSecretProviderPath, clearSecretProviderPath] = useInput('');
    const [secretProviders, setSecretProviders] = useState<SecretProvidersWidget.DataItem[]>();

    useOpenProp(open, () => {
        setLoading();
        enableSecretUpdate();
        clearErrors();
        clearSecretValue();
        clearSecretProvider();
        clearSecretProviderPath();
        fetchSecretProviders();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());

        const hasSecretProvider = !isEmpty(secret.provider_name);
        if (secret) {
            const isHidden = secret.is_hidden_value;
            if (hasSecretProvider) {
                setUseSecretProvider();
                actions
                    .doGetSkipValue(secret.key)
                    .then(({ provider_name: providerName, provider_options: providerOptions }) => {
                        setSecretProvider(providerName);

                        try {
                            const parsedSecretProvideOptions = JSON.parse(providerOptions as unknown as string);
                            setSecretProviderPath(parsedSecretProvideOptions.path);
                        } catch (e) {
                            setSecretProviderPath('');
                        }
                    });
            } else {
                unsetUseSecretProvider();
                actions
                    .doGet(secret.key)
                    .then(({ value }) => {
                        setSecretValue(value);
                        setSecretProvider('');
                        setSecretProviderPath('');
                    })
                    .catch(setMessageAsError);
            }

            if (isHidden) {
                disableSecretUpdate();
            } else {
                enableSecretUpdate();
            }
        }

        unsetLoading();
    });

    function updateSecret() {
        clearErrors();
        if (!useSecretProvider && isEmpty(secretValue)) {
            setErrors({ secretValue: translateForm('errors.validation.secretValue') });
            return;
        }
        if (useSecretProvider) {
            if (isEmpty(secretProvider) || isEmpty(secretProviderPath)) {
                setErrors({
                    secretProvider: isEmpty(secretProvider)
                        ? translateForm('errors.validation.secretProvider')
                        : undefined,
                    secretProviderPath: isEmpty(secretProviderPath)
                        ? translateForm('errors.validation.secretProviderPath')
                        : undefined
                });
                return;
            }
        }

        if (!isEmpty(errors)) {
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        const formattedOptions = secretProviderPath ? { path: secretProviderPath } : undefined;
        actions
            .doUpdate(secret.key, secretValue, secretProvider, formattedOptions)
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
        clearErrors();

        if (useSecretProvider) {
            unsetUseSecretProvider();
            clearSecretProvider();
            clearSecretProviderPath();
        }
        if (!useSecretProvider) {
            setUseSecretProvider();
        }
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
