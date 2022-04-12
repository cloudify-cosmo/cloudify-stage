const {
    Basic: { Modal, Icon, CancelButton, ApproveButton }
} = Stage;

interface CreateTokenModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateTokenModal = ({ open, onClose }: CreateTokenModalProps) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <Icon name="add" />
                Create token
            </Modal.Header>
            <Modal.Content>Some content</Modal.Content>
            <Modal.Actions>
                <CancelButton content="Cancel" onClick={onClose} />
                <ApproveButton content="Create" color="green" icon="plus" />
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTokenModal;
