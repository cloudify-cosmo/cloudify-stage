import { TokensWidget } from './types';

const {
    Basic: { Icon, Confirm: DeleteModal },
    Hooks: { useBoolean }
} = Stage;

interface RemoveTokenButtonProps {
    tokenId: TokensWidget.DataItem['id'];
}

const RemoveTokenButton = ({ tokenId }: RemoveTokenButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();

    const removeToken = () => {
        hideModal();
    };

    return (
        <>
            <Icon bordered link name="trash" title="Delete secret" onClick={showModal} />
            {isModalVisible && (
                <DeleteModal
                    open
                    content={`Are you sure you want to delete the token with ID ${tokenId}`}
                    onCancel={hideModal}
                    onConfirm={removeToken}
                />
            )}
        </>
    );
};

export default RemoveTokenButton;
