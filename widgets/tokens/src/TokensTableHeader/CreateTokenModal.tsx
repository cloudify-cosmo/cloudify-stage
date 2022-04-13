import { useState } from 'react';
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

enum SubmittingStatus {
    INITIAL,
    SUBMITTING,
    SUBMITTED,
    ERROR
}

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
    const [submittingStatus, setSubmittingStatus] = useState<SubmittingStatus>(SubmittingStatus.INITIAL);
    const [tokenValue, setTokenValue] = useState<ReceivedToken['value']>();
    const manager = toolbox.getManager();

    const handleSubmit = () => {
        setSubmittingStatus(SubmittingStatus.SUBMITTING);
        manager
            .doPost('/tokens', {
                body: {
                    description,
                    expiration_date: null
                }
            })
            .then((token: ReceivedToken) => {
                setSubmittingStatus(SubmittingStatus.SUBMITTED);
                setTokenValue(token.value);
            })
            .catch(() => {
                setSubmittingStatus(SubmittingStatus.ERROR);
            });
    };

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>
                <Icon name="add" />
                Create token
            </Modal.Header>
            <Modal.Content>
                {submittingStatus === SubmittingStatus.SUBMITTED ? (
                    <CreatedToken value={tokenValue!} />
                ) : (
                    <Form>
                        <Form.Field label="Description">
                            <Input value={description} onChange={setDescription} />
                        </Form.Field>
                    </Form>
                )}
                {submittingStatus === SubmittingStatus.SUBMITTING && <LoadingOverlay />}
            </Modal.Content>
            <Modal.Actions>
                {submittingStatus !== SubmittingStatus.SUBMITTED ? (
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
