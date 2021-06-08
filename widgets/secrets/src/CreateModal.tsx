/**
 * Created by jakubniezgoda on 24/03/2017.
 */

export default function CreateModal({ toolbox }) {
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
        const validationErrors = {};

        if (_.isEmpty(secretKey)) {
            validationErrors.secretKey = 'Please provide secret key';
        }

        if (_.isEmpty(secretValue)) {
            validationErrors.secretValue = 'Please provide secret value';
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Stage.Common.SecretActions(toolbox);
        actions
            .doCreate(secretKey, secretValue, visibility, isHiddenValue)
            .then(() => {
                doClose();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onSecretFileChange(file) {
        if (!file) {
            clearErrors();
            setInput({ secretValue: '' });
            return;
        }

        setFileLoading();

        const actions = new Stage.Common.FileActions(toolbox);
        actions
            .doGetTextFileContent(file)
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
    const { ApproveButton, Button, CancelButton, Icon, Form, Modal, VisibilityField } = Stage.Basic;
    const createButton = <Button content="Create" icon="add" labelPosition="left" />;

    return (
        <Modal trigger={createButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add" /> Create secret
                <VisibilityField visibility={visibility} className="rightFloated" onVisibilityChange={setVisibility} />
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.secretKey}>
                        <Form.Input name="secretKey" placeholder="Secret key" value={secretKey} onChange={setInput} />
                    </Form.Field>
                    <Form.Field error={errors.secretValue}>
                        <Form.TextArea
                            name="secretValue"
                            placeholder="Secret value"
                            autoHeight
                            value={secretValue}
                            onChange={setInput}
                        />
                    </Form.Field>
                    <Form.Field error={errors.secretFile}>
                        <Form.File
                            name="secretFile"
                            placeholder="Get secret value from file (max: 50kB)"
                            onChange={onSecretFileChange}
                            loading={isFileLoading}
                            disabled={isFileLoading}
                        />
                    </Form.Field>
                    <Form.Field error={errors.isHiddenValue}>
                        <Form.Checkbox
                            name="isHiddenValue"
                            label="Hidden Value"
                            checked={isHiddenValue}
                            onChange={setInput}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton onClick={createSecret} disabled={isLoading} content="Create" icon="add" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

CreateModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
