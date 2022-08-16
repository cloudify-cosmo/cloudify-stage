import type { FunctionComponent } from 'react';
import { useState } from 'react';
import Consts from '../Consts';
import SecretActions from './SecretActions';
import type { Visibility } from './SecretActions';
import TogglableSecretsInput from './TogglableSecretsInput';

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

type IsSecretMultiline = {
    [key: string]: boolean;
};

const t = Stage.Utils.getT('widgets.common.deployments.secretsModal');

const SecretsModal: FunctionComponent<SecretsModalProps> = ({ toolbox, onClose, open, secretKeys, onAdd }) => {
    if (!Array.isArray(secretKeys)) {
        return null;
    }
    const { useBoolean, useInputs, useErrors } = Stage.Hooks;
    const { ApproveButton, CancelButton, Form, Modal, Checkbox, Grid } = Stage.Basic;

    const initialInputs: secretInputsType = secretKeys.reduce((prev, secretKey) => ({ ...prev, [secretKey]: '' }), {});

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [secretInputs, setSecretInputs] = useInputs(initialInputs);

    const initializeSecretCheckboxes = (): IsSecretMultiline => {
        return secretKeys.reduce((checkboxes: IsSecretMultiline, secretKey) => {
            checkboxes[secretKey] = false;
            return checkboxes;
        }, {});
    };

    const [secretMultiline, setSecretMultiline] = useState<IsSecretMultiline>(initializeSecretCheckboxes);

    const toggleCheckbox = (secretKey: string) => {
        const checkboxState = secretMultiline[secretKey];
        setSecretMultiline({
            ...secretMultiline,
            [secretKey]: !checkboxState
        });
    };

    const onSave = () => {
        const keys = Object.keys(secretInputs);

        if (keys.some(key => secretInputs[key].trim() === '')) {
            setMessageAsError({ message: t('errors.noSecretValues') });
            return;
        }

        setLoading();

        const isHiddenValue = true;
        const visibility = Consts.defaultVisibility as Visibility;
        const actions = new SecretActions(toolbox);
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
            <Modal.Header>{t('header')}</Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14} />
                            <Grid.Column width={2} style={{ paddingLeft: '50px', marginBottom: '-20px' }}>
                                <p>{t('checkboxLabel')}</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {secretKeys.map(field => (
                        <Form.Field key={field} required label={field}>
                            <Form.Group>
                                <TogglableSecretsInput
                                    showMultilineInput={secretMultiline[field]}
                                    name={field}
                                    value={secretInputs[field]}
                                    placeholder={t('placeholder')}
                                    onChange={setSecretInputs}
                                    width={15}
                                />
                                <Checkbox
                                    style={{ marginTop: '10px' }}
                                    checked={secretMultiline[field]}
                                    onChange={() => toggleCheckbox(field)}
                                />
                            </Form.Group>
                        </Form.Field>
                    ))}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onClose} disabled={isLoading} />
                <ApproveButton onClick={onSave} disabled={isLoading} content={t('buttons.add')} icon="plus" />
            </Modal.Actions>
        </Modal>
    );
};

export default SecretsModal;
