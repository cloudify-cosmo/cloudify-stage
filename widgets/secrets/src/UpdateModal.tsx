// @ts-nocheck File not migrated fully to TS
import SecretPropType from './props/SecretPropType';

const { Modal, Icon, Form, ApproveButton, CancelButton, ErrorMessage } = Stage.Basic;
const { MultilineInput } = Stage.Common.Secrets;

export default function UpdateModal({ open, secret, toolbox, onHide }) {
    const { useBoolean, useErrors, useOpenProp, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [canUpdateSecret, enableSecretUpdate, disableSecretUpdate] = useBoolean(true);
    const [secretValue, setSecretValue, clearSecretValue] = useInput('');

    useOpenProp(open, () => {
        setLoading();
        enableSecretUpdate();
        clearErrors();
        clearSecretValue();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doGet(secret.key)
            .then(({ is_hidden_value: isHidden, value }) => {
                clearErrors();
                setSecretValue(value);

                if (isHidden && _.isEmpty(value)) {
                    disableSecretUpdate();
                } else {
                    enableSecretUpdate();
                }
            })
            .catch(err => setErrors({ secretValue: err.message }))
            .finally(unsetLoading);
    });

    function updateSecret() {
        if (_.isEmpty(secretValue)) {
            setErrors({ secretValue: 'Please provide secret value' });
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doUpdate(secret.key, secretValue)
            .then(() => {
                clearErrors();
                onHide();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const currentUsername = toolbox.getManager().getCurrentUsername();
    const selectedTenant = toolbox.getManager().getSelectedTenant();

    return (
        <div>
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="edit" /> Update secret {secret.key}
                </Modal.Header>

                <Modal.Content>
                    {!canUpdateSecret && (
                        <ErrorMessage
                            error={`User \`${currentUsername}\` is not permitted to update value of the secret '${secret.key}' in the tenant \`${selectedTenant}\` .`}
                        />
                    )}
                    <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                        {canUpdateSecret && (
                            <Form.Field error={errors.secretValue}>
                                <MultilineInput
                                    name="secretValue"
                                    placeholder="Secret value"
                                    value={secretValue}
                                    onChange={setSecretValue}
                                />
                            </Form.Field>
                        )}
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={isLoading} />
                    {canUpdateSecret && (
                        <ApproveButton onClick={updateSecret} disabled={isLoading} content="Update" icon="edit" />
                    )}
                </Modal.Actions>
            </Modal>
        </div>
    );
}

UpdateModal.propTypes = {
    secret: SecretPropType.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func
};

UpdateModal.defaultProps = {
    onHide: () => {}
};
