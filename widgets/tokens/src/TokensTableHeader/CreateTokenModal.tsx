import { useState } from 'react';
import { flushSync } from 'react-dom';
import { translationPath } from '../widget.consts';
import { tableRefreshEvent } from '../TokensTable.consts';
import { RequestStatus } from '../types';
import CreatedToken from './CreatedToken';
import type { ReceivedToken } from './CreateTokenModal.types';

const { useInput } = Stage.Hooks;
const { getT } = Stage.Utils;
const { Modal, Icon, CancelButton, ApproveButton, Input, Form, LoadingOverlay, Message } = Stage.Basic;

const t = getT(`${translationPath}.createModal`);

interface CreateTokenModalProps {
    onClose: () => void;
    toolbox: Stage.Types.Toolbox;
}

const CreateTokenModal = ({ onClose, toolbox }: CreateTokenModalProps) => {
    const [description, setDescription] = useInput('');
    const [submittingStatus, setSubmittingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const [receivedToken, setReceivedToken] = useState<ReceivedToken>();
    const showCreateForm = submittingStatus !== RequestStatus.SUBMITTED;
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
                flushSync(() => {
                    setSubmittingStatus(RequestStatus.SUBMITTED);
                    setReceivedToken(token);
                });
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
                {submittingStatus === RequestStatus.ERROR && <Message error content={t('error')} />}
                {showCreateForm ? (
                    <Form>
                        <Form.Field label={t('inputs.description')}>
                            <Input value={description} onChange={setDescription} name="description" />
                        </Form.Field>
                    </Form>
                ) : (
                    <CreatedToken token={receivedToken!} />
                )}
                {submittingStatus === RequestStatus.SUBMITTING && <LoadingOverlay />}
            </Modal.Content>
            <Modal.Actions>
                {showCreateForm ? (
                    <>
                        <CancelButton content={t('buttons.cancel')} onClick={onClose} />
                        <ApproveButton content={t('buttons.create')} icon="plus" onClick={handleSubmit} />
                    </>
                ) : (
                    <CancelButton content={t('buttons.close')} onClick={onClose} />
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTokenModal;
