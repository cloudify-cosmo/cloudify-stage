import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import Consts from '../Consts';
import SecretActions from './SecretActions';
import SinglelineInput from './SinglelineInput';
import MultilineInput from './MultilineInput';
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
    const { ApproveButton, CancelButton, Form, Modal, Checkbox } = Stage.Basic;

    const initialInputs: secretInputsType = secretKeys.reduce((prev, secretKey) => ({ ...prev, [secretKey]: '' }), {});

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [secretInputs, setSecretInputs] = useInputs(initialInputs);

    const secretKeysWithCheckbox = secretKeys.map(field => ({ field, isChecked: false }));
    const [secretKeysWithCheckboxState, setSecretKeysWithCheckboxState] = useState(secretKeysWithCheckbox);

    const toggleCheckbox = (secretKey: string) => {
        const newSecretKeysWithCheckboxState = secretKeysWithCheckboxState.map(secretKeyWithCheckbox => {
            if (secretKeyWithCheckbox.field === secretKey) {
                return { ...secretKeyWithCheckbox, isChecked: !secretKeyWithCheckbox.isChecked };
            }
            return secretKeyWithCheckbox;
        });
        setSecretKeysWithCheckboxState(newSecretKeysWithCheckboxState);
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
                            <Grid.Column width={2} style={{ marginBottom: '-20px' }}>
                                <p>Multiline</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {secretKeysWithCheckboxState.map(({ field, isChecked }) => (
                        <Form.Field key={field} required label={field}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={14}>
                                        {isChecked ? (
                                            <MultilineInput
                                                name={field}
                                                value={secretInputs[field]}
                                                placeholder="Secret value"
                                                onChange={setSecretInputs}
                                            />
                                        ) : (
                                            <SinglelineInput
                                                name={field}
                                                value={secretInputs[field]}
                                                onChange={setSecretInputs}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column width={2}>
                                        <Checkbox
                                            style={{ marginTop: '10px' }}
                                            checked={isChecked}
                                            onChange={() => toggleCheckbox(field)}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
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
