import { isEmpty } from 'lodash';
import type { Secret } from './widget.types';

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

                if (isHidden && isEmpty(value)) {
                    disableSecretUpdate();
                } else {
                    enableSecretUpdate();
                }
            })
            .catch(err => setErrors({ secretValue: err.message }))
            .finally(unsetLoading);
    });

    function updateSecret() {
        if (isEmpty(secretValue)) {
            setErrors({ secretValue: translateUpdateModal('errors.validation.secretValue') });
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

    const headerContent = translateUpdateModal('header', { secretKey: secret.key });

    const noPermissionError = translateUpdateModal('errors.noPermission', {
        currentUsername,
        secretKey: secret.key,
        selectedTenant
    });

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
                            <Form.Field error={errors.secretValue}>
                                <MultilineInput
                                    name="secretValue"
                                    placeholder={translateUpdateModal('inputs.secretValue.placeholder')}
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
