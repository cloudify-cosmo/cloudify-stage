import { useState } from 'react';
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

interface ReceivedToken {
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
    const [tokenValue, setTokenValue] = useState<ReceivedToken['value']>();
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
                setSubmittingStatus(RequestStatus.SUBMITTED);
                setTokenValue(token.value);
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
                    <CreatedToken value={tokenValue!} />
                ) : (
                    <Form>
                        <Form.Field label="Description">
                            <Input value={description} onChange={setDescription} />
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
