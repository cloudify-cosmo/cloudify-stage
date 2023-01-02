import { isEmpty } from 'lodash';

const { ApproveButton, Button, CancelButton, Icon, Form, Modal, VisibilityField } = Stage.Basic;
const { MultilineInput } = Stage.Common.Secrets;

interface CreateModalProps {
    toolbox: Stage.Types.Toolbox;
}
type FileValue = File | File[] | null;

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
        isHiddenValue: false
    });
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearErrors();
        clearInputs();
        clearVisibility();
    });

    function createSecret() {
        const { isHiddenValue, secretKey, secretValue } = inputs;
        const validationErrors: Record<string, string> = {};

        if (isEmpty(secretKey)) {
            validationErrors.secretKey = translateCreateModal('errors.validation.secretKey');
        }

        if (isEmpty(secretValue)) {
            validationErrors.secretValue = translateCreateModal('errors.validation.secretValue');
        }

        if (!isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doCreate(secretKey, secretValue, visibility, isHiddenValue)
            .then(() => {
                doClose();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onSecretFileChange(file: FileValue) {
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
    }

    const { isHiddenValue, secretKey, secretValue } = inputs;
    const createButton = <Button content={translateCreateModal('buttons.create')} icon="add" labelPosition="left" />;

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
                    <Form.Field error={errors.secretValue}>
                        <MultilineInput
                            name="secretValue"
                            placeholder={translateCreateModal('inputs.secretValue.placeholder')}
                            value={secretValue}
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
