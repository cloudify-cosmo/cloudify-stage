import type { FunctionComponent } from 'react';

interface SecretsModalProps {
    toolbox: Stage.Types.Toolbox;
    secretKeys: Array<string>;
    open: boolean;
    onClose: () => void;
}

type secretInputsType = {
    [key: string]: string;
};

const { i18n } = Stage;
const t = (key: string) => i18n.t(`widgets.common.deployments.secretsModal.${key}`);

const SecretsModal: FunctionComponent<SecretsModalProps> = ({ toolbox, onClose, open, secretKeys }) => {
    if (!Array.isArray(secretKeys)) {
        return null;
    }
    const { useBoolean, useInputs, useErrors } = Stage.Hooks;
    const { ApproveButton, CancelButton, Form, Icon, Input, Modal } = Stage.Basic;
    const { defaultVisibility } = Stage.Common.Consts;

    const initialInputs: secretInputsType = secretKeys.reduce((prev, secretKey) => ({ ...prev, [secretKey]: '' }), {});

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [secretInputs, setSecretInputs] = useInputs(initialInputs);

    const onSave = () => {
        const keys = Object.keys(secretInputs);

        if (keys.some(key => secretInputs[key].trim() === '')) {
            setMessageAsError({ message: t('errors.noSecretValues') });
            return;
        }

        setLoading();

        const isHiddenValue = true;
        const visibility = defaultVisibility;
        const actions = new Stage.Common.SecretActions(toolbox);
        Promise.all(
            keys.map(secretKey => {
                return actions.doCreate(secretKey, secretInputs[secretKey], visibility, isHiddenValue);
            })
        )
            .catch(setMessageAsError)
            .finally(() => {
                unsetLoading();

                onClose();
                toolbox.refresh();
            });
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <Icon name="key" />
                {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {secretKeys.map(field => (
                        <Form.Input key={field}>
                            <Input type="password" required name={field} label={field} onChange={setSecretInputs} />
                        </Form.Input>
                    ))}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onClose} disabled={isLoading} />
                <ApproveButton
                    onClick={onSave}
                    disabled={isLoading}
                    content={t('buttons.save')}
                    icon="plus"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default SecretsModal;
