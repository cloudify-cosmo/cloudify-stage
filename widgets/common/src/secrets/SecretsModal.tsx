import type { FunctionComponent } from 'react';
import type { Visibility } from './SecretActions';

interface SecretsModalProps {
    toolbox: Stage.Types.Toolbox;
    secretKeys: Array<string>;
    open: boolean;
    onClose: () => void;
    onAdd: () => void;
}

type secretInputsType = {
    [key: string]: string;
};

const t = Stage.Utils.getT('widgets.common.deployments.secretsModal');

const SecretsModal: FunctionComponent<SecretsModalProps> = ({ toolbox, onClose, open, secretKeys, onAdd }) => {
    if (!Array.isArray(secretKeys)) {
        return null;
    }
    const { useBoolean, useInputs, useErrors } = Stage.Hooks;
    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;

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
        const visibility = Stage.Common.Consts.defaultVisibility as Visibility;
        const actions = new Stage.Common.SecretActions(toolbox);
        Promise.all(
            keys.map(secretKey => actions.doCreate(secretKey, secretInputs[secretKey], visibility, isHiddenValue))
        )
            .catch(setMessageAsError)
            .finally(() => {
                clearErrors();
                unsetLoading();
                onClose();
                toolbox.refresh();
                onAdd();
            });
    };
    return (
        <Modal open={open} onClose={onClose} className="secretsModal">
            <Modal.Header>
                <Icon name="plus" />
                {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {secretKeys.map(field => (
                        <Form.Field key={field} required label={field}>
                            <Form.Input type="password" name={field} onChange={setSecretInputs} />
                        </Form.Field>
                    ))}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onClose} disabled={isLoading} />
                <ApproveButton
                    onClick={onSave}
                    disabled={isLoading}
                    content={t('buttons.add')}
                    icon="plus"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default SecretsModal;
