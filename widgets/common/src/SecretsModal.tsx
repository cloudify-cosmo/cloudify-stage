import type { FunctionComponent } from 'react';

interface SecretsModalProps {
    toolbox: Stage.Types.Toolbox;
    secretKeys: Array<string>;
    open: boolean;
    onClose: () => void;
}

type secretInputsType = {
    [key: string]: boolean;
};

const { i18n } = Stage;
const t = (key: string) => i18n.t(`widgets.common.deployments.secretsModal.${key}`);

const SecretsModal: FunctionComponent<SecretsModalProps> = ({ toolbox, onClose, open, secretKeys }) => {
    if (!Array.isArray(secretKeys)) {
        return null;
    }
    const { useBoolean, useInputs, useErrors } = Stage.Hooks;
    const { ApproveButton, CancelButton, Form, UnsafelyTypedFormField, Icon, Input, Modal } = Stage.Basic;
    const { defaultVisibility } = Stage.Common.Consts;

    const initialInputs: secretInputsType = secretKeys.reduce((prev, secretKey) => ({ ...prev, [secretKey]: '' }), {});

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [secretInputs, setSecretInputs] = useInputs(initialInputs);

    const onSave = () => {
        const keys = Object.keys(secretInputs);

        if (keys.some(key => _.isEmpty(secretInputs[key]))) {
            setErrors({});
            return;
        }

        setLoading();

        const isHiddenValue = true;
        const visibility = defaultVisibility;
        const actions = new Stage.Common.SecretActions(toolbox);
        keys.forEach(secretKey => {
            actions
                .doCreate(secretKey, secretInputs[secretKey], visibility, isHiddenValue)
                .then(() => {
                    onClose();
                    toolbox.refresh();
                })
                .catch(setMessageAsError)
                .finally(unsetLoading);
        });
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <Icon name="cogs" />
                {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {secretKeys.map(field => (
                        <UnsafelyTypedFormField key={field}>
                            <Input type="text" name={field} label={field} onChange={setSecretInputs} />
                        </UnsafelyTypedFormField>
                    ))}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onClose} disabled={isLoading} />
                <ApproveButton
                    onClick={onSave}
                    disabled={isLoading}
                    content={t('buttons.save')}
                    icon="cogs"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default SecretsModal;
