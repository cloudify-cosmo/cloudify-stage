import { isEmpty } from 'lodash';
import type { FileInputProps } from 'cloudify-ui-components/typings/components/form/FileInput/FileInput';
import { useEffect, useState } from 'react';
import type { SecretProvidersWidget } from '../../secretProviders/src/widget.types';

const { ApproveButton, Button, CancelButton, Icon, Form, Modal, VisibilityField } = Stage.Basic;
const { MultilineInput } = Stage.Common.Secrets;

interface CreateModalProps {
    toolbox: Stage.Types.Toolbox;
}

const translateCreateModal = Stage.Utils.getT('widgets.secrets.createModal');

export default function CreateModal({ toolbox }: CreateModalProps) {
    const { useBoolean, useErrors, useOpen, useInputs, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [isFileLoading, setFileLoading, unsetFileLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useInput(Stage.Common.Consts.defaultVisibility);
    const [inputs, setInput, clearInputs] = useInputs({
        secretKey: '',
        secretValue: null,
        isHiddenValue: false,
        enableSecretProvider: false,
        secretProvider: null,
        secretProviderPath: null
    });
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearErrors();
        clearInputs();
        clearVisibility();
    });

    const [secretProviders, setSecretProviders] = useState<SecretProvidersWidget.DataItem[]>();

    useEffect(() => {
        fetchSecretProviders();
    }, []);

    function createSecret() {
        const { isHiddenValue, secretKey, secretValue, enableSecretProvider, secretProvider, secretProviderPath } =
            inputs;
        const validationErrors: Record<string, string> = {};

        if (isEmpty(secretKey)) {
            validationErrors.secretKey = translateCreateModal('errors.validation.secretKey');
        }

        if (!enableSecretProvider && isEmpty(secretValue)) {
            validationErrors.secretValue = translateCreateModal('errors.validation.secretValue');
        }

        if (enableSecretProvider && isEmpty(secretProvider)) {
            validationErrors.secretProvider = translateCreateModal('errors.validation.secretProviderName');
        }
        if (enableSecretProvider && isEmpty(secretProviderPath)) {
            validationErrors.secretProviderPath = translateCreateModal('errors.validation.secretProviderPath');
        }

        if (!isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        const secretOptions = enableSecretProvider ? { path: secretProviderPath } : {};

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doCreate(secretKey, secretValue, visibility, isHiddenValue, secretProvider, secretOptions)
            .then(() => {
                doClose();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onSecretProviderChange() {
        if (errors.secretValue) {
            clearErrors();
        }
        setInput({ enableSecretProvider: !enableSecretProvider });
    }

    const onSecretFileChange: FileInputProps['onChange'] = file => {
        if (!file) {
            clearErrors();
            setInput({ secretValue: '' });
            return;
        }

        setFileLoading();

        const actions = new Stage.Common.Actions.File(toolbox);
        actions
            .doGetTextFileContent(file as File)
            .then(secretValue => {
                setInput({ secretValue });
                clearErrors();
            })
            .catch(err => {
                setInput({ secretValue: '' });
                setMessageAsError(err);
            })
            .finally(unsetFileLoading);
    };

    const { isHiddenValue, secretKey, secretValue, enableSecretProvider, secretProvider, secretProviderPath } = inputs;
    const createButton = <Button content={translateCreateModal('buttons.create')} icon="add" labelPosition="left" />;

    function fetchSecretProviders() {
        const secretActions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        secretActions.doGetAllSecretProviders().then(data => {
            return setSecretProviders(data.items);
        });
    }
    const secretProviderOptions = secretProviders?.map((item: { name: string }) => ({
        text: item.name,
        value: item.name
    }));

    return (
        <Modal trigger={createButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add" /> {translateCreateModal('header')}
                <VisibilityField visibility={visibility} className="rightFloated" onVisibilityChange={setVisibility} />
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.secretKey}>
                        <Form.Input
                            name="secretKey"
                            placeholder={translateCreateModal('inputs.secretKey.placeholder')}
                            value={secretKey}
                            onChange={setInput}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Checkbox
                            label={translateCreateModal('inputs.enableSecretProvider.label')}
                            name="enableSecretProvider"
                            checked={enableSecretProvider}
                            onChange={onSecretProviderChange}
                        />
                    </Form.Field>
                    {enableSecretProvider ? (
                        <>
                            <Form.Field label="Secret provider" error={errors.secretProviderName} required>
                                <Form.Dropdown
                                    name="secretProvider"
                                    placeholder="Select secret provider"
                                    selection
                                    options={secretProviderOptions}
                                    onChange={setInput}
                                    value={secretProvider as unknown as string}
                                />
                            </Form.Field>
                            <Form.Field error={errors.secretProviderPath}>
                                <Form.Input
                                    label="Secret provider path"
                                    name="secretProviderPath"
                                    placeholder="Secret provider path"
                                    value={secretProviderPath}
                                    onChange={setInput}
                                />
                            </Form.Field>
                        </>
                    ) : (
                        <>
                            <Form.Field error={errors.secretValue}>
                                <MultilineInput
                                    name="secretValue"
                                    placeholder={translateCreateModal('inputs.secretValue.placeholder')}
                                    value={secretValue as unknown as string}
                                    onChange={setInput}
                                />
                            </Form.Field>
                            <Form.Field error={errors.secretFile}>
                                <Form.File
                                    name="secretFile"
                                    placeholder={translateCreateModal('inputs.secretFile.placeholder')}
                                    onChange={onSecretFileChange}
                                    loading={isFileLoading}
                                    disabled={isFileLoading}
                                />
                            </Form.Field>
                        </>
                    )}
                    <Form.Field error={errors.isHiddenValue}>
                        <Form.Checkbox
                            name="isHiddenValue"
                            label={translateCreateModal('inputs.hiddenValue.label')}
                            checked={isHiddenValue}
                            onChange={setInput}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={createSecret}
                    disabled={isLoading}
                    content={translateCreateModal('buttons.create')}
                    icon="add"
                />
            </Modal.Actions>
        </Modal>
    );
}
