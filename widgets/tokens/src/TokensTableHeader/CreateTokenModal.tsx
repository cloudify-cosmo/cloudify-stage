import { useState } from 'react';
import { TokensTableConsts } from '../TokensTable.consts';
import { RequestStatus } from '../types';
import CreatedToken from './CreatedToken';

const {
    Basic: { Modal, Icon, CancelButton, ApproveButton, Input, Form, LoadingOverlay },
    Hooks: { useInput }
} = Stage;

interface CreateTokenModalProps {
    onClose: () => void;
    toolbox: Stage.Types.Toolbox;
}

// interface CreateTokensDto {
//     description: string;
//     expiration_date: null;
// }

export interface ReceivedToken {
    id: string;
    description: string;
    expiration_date: null;
    last_used: null;
    username: string;
    value: string;
    role: string;
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
                toolbox.getEventBus().trigger(TokensTableConsts.tableRefreshEvent);
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
                Create token
            </Modal.Header>
            <Modal.Content>
                {submittingStatus === RequestStatus.SUBMITTED ? (
                    <CreatedToken token={receivedToken!} />
                ) : (
                    <Form>
                        <Form.Field label="Description">
                            <Input value={description} onChange={setDescription} name="description" />
                        </Form.Field>
                    </Form>
                )}
                {submittingStatus === RequestStatus.SUBMITTING && <LoadingOverlay />}
            </Modal.Content>
            <Modal.Actions>
                {submittingStatus !== RequestStatus.SUBMITTED ? (
                    <>
                        <CancelButton content="Cancel" onClick={onClose} />
                        <ApproveButton content="Create" color="green" icon="plus" onClick={handleSubmit} />
                    </>
                ) : (
                    <CancelButton content="Close" onClick={onClose} />
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTokenModal;
