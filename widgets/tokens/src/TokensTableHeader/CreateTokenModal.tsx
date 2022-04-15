import { useState } from 'react';
import { translationPath } from '../widget.consts';
import { tableRefreshEvent } from '../TokensTable.consts';
import { RequestStatus } from '../types';
import CreatedToken from './CreatedToken';
import type { ReceivedToken } from './CreateTokenModal.types';

const {
    Basic: { Modal, Icon, CancelButton, ApproveButton, Input, Form, LoadingOverlay },
    Utils: { getT },
    Hooks: { useInput }
} = Stage;

const t = getT(`${translationPath}.createModal`);

interface CreateTokenModalProps {
    onClose: () => void;
    toolbox: Stage.Types.Toolbox;
}

const CreateTokenModal = ({ onClose, toolbox }: CreateTokenModalProps) => {
    const [description, setDescription] = useInput('');
    // TODO: Provide error handling
    const [submittingStatus, setSubmittingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const [receivedToken, setReceivedToken] = useState<ReceivedToken>({
        description: 'test',
        expiration_date: null,
        id: '321fdsafadsf243',
        last_used: null,
        role: 'admin',
        username: 'Woooah',
        value: 'some_big_token_value_which_should_be_displayed'
    });
    const manager = toolbox.getManager();

    const handleSubmit = () => {
        setSubmittingStatus(RequestStatus.SUBMITTING);
        manager
            .doPost('/tokens', {
                body: {
                    description,
                    expiration_date: null
                }
            })
            .then((token: ReceivedToken) => {
                toolbox.getEventBus().trigger(tableRefreshEvent);
                setSubmittingStatus(RequestStatus.SUBMITTED);
                setReceivedToken(token);
            })
            .catch(() => {
                setSubmittingStatus(RequestStatus.ERROR);
            });
    };

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>
                <Icon name="add" />
                {t('header')}
            </Modal.Header>
            <Modal.Content>
                {submittingStatus === RequestStatus.SUBMITTED ? (
                    <CreatedToken token={receivedToken!} />
                ) : (
                    <Form>
                        <Form.Field label={t('inputs.description')}>
                            <Input value={description} onChange={setDescription} name="description" />
                        </Form.Field>
                    </Form>
                )}
                {submittingStatus === RequestStatus.SUBMITTING && <LoadingOverlay />}
            </Modal.Content>
            <Modal.Actions>
                {submittingStatus !== RequestStatus.SUBMITTED ? (
                    <>
                        <CancelButton content={t('buttons.cancel')} onClick={onClose} />
                        <ApproveButton content={t('buttons.create')} color="green" icon="plus" onClick={handleSubmit} />
                    </>
                ) : (
                    <CancelButton content={t('buttons.close')} onClick={onClose} />
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTokenModal;
