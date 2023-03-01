import { isEmpty } from 'lodash';
import type { FileInputProps } from 'cloudify-ui-components';
import { useState } from 'react';
import type { SecretProvidersWidget } from '../../secretProviders/src/widget.types';
import { translateForm } from './widget.utils';

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
        secretValue: '',
        isHiddenValue: false,
        useSecretProvider: false,
        secretProvider: '',
        secretProviderPath: ''
    });
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearErrors();
        clearInputs();
        clearVisibility();
        fetchSecretProviders();
    });

    const [secretProviders, setSecretProviders] = useState<SecretProvidersWidget.DataItem[]>();

    function createSecret() {
        const { isHiddenValue, secretKey, secretValue, useSecretProvider, secretProvider, secretProviderPath } = inputs;
        const validationErrors: Record<string, string> = {};

        if (isEmpty(secretKey)) {
            validationErrors.secretKey = translateForm('errors.validation.secretKey');
        }

        if (useSecretProvider) {
            if (isEmpty(secretProvider)) {
                validationErrors.secretProvider = translateForm('errors.validation.secretProvider');
            }
            if (isEmpty(secretProviderPath)) {
                validationErrors.secretProviderPath = translateForm('errors.validation.secretProviderPath');
            }
        } else if (isEmpty(secretValue)) {
            validationErrors.secretValue = translateForm('errors.validation.secretValue');
        }

        if (!isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doCreate(secretKey, secretValue, visibility, isHiddenValue, secretProvider, secretProviderPath)
            .then(() => {
                doClose();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onSecretProviderChange() {
        if (errors.secretValue) {
            setErrors({ ...errors, secretValue: null });
        }
        if (isEmpty(secretProviders)) {
            setErrors({ ...errors, secretProviderCheckbox: translateForm('errors.validation.noProviders') });
            return;
        }
        setInput({ useSecretProvider: !useSecretProvider });
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

    function fetchSecretProviders() {
        const secretActions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        secretActions
            .doGetAllSecretProviders()
            .then(data => setSecretProviders(data.items))
            .catch(setMessageAsError);
    }
    const secretProvidersDropdownOptions = secretProviders?.map((item: { name: string }) => ({
        text: item.name,
        value: item.name
    }));

    const { isHiddenValue, secretKey, secretValue, useSecretProvider, secretProvider, secretProviderPath } = inputs;

    const createButton = <Button content={translateCreateModal('buttons.create')} icon="add" labelPosition="left" />;

    return (
        <Modal trigger={createButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add" /> {translateCreateModal('header')}
                <VisibilityField visibility={visibility} className="rightFloated" onVisibilityChange={setVisibility} />
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={translateForm('inputs.secretKey.label')} error={errors.secretKey} required>
                        <Form.Input
                            name="secretKey"
                            placeholder={translateForm('inputs.secretKey.placeholder')}
                            value={secretKey}
                            onChange={setInput}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Checkbox
                            label={translateForm('inputs.useSecretProvider.label')}
                            name="useSecretProvider"
                            checked={useSecretProvider}
                            onChange={onSecretProviderChange}
                            disabled={isEmpty(secretProviders)}
                            help={isEmpty(secretProviders) ? translateForm('errors.validation.noProviders') : null}
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
                                    onChange={setInput}
                                    value={secretProvider}
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
                                    onChange={setInput}
                                />
                            </Form.Field>
                        </>
                    ) : (
                        <>
                            <Form.Field error={errors.secretValue}>
                                {/* TODO Norbert: Provide label */}
                                <MultilineInput
                                    name="secretValue"
                                    placeholder={translateForm('inputs.secretValue.placeholder')}
                                    value={secretValue}
                                    onChange={setInput}
                                />
                            </Form.Field>
                            <Form.Field error={errors.secretFile}>
                                <Form.File
                                    name="secretFile"
                                    placeholder={translateForm('inputs.secretFile.placeholder')}
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
                            label={translateForm('inputs.hiddenValue.label')}
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
