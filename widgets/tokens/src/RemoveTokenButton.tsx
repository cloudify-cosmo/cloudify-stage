import { useEffect, useState } from 'react';
import { TokensTableConsts } from './TokensTable.consts';
import { RequestStatus, TokensWidget } from './types';

const {
    Basic: { Icon, Confirm: DeleteModal },
    Hooks: { useBoolean }
} = Stage;

interface RemoveTokenButtonProps {
    tokenId: TokensWidget.DataItem['id'];
    toolbox: Stage.Types.Toolbox;
}

const RemoveTokenButton = ({ tokenId, toolbox }: RemoveTokenButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();
    const [deletingStatus, setDeletingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);

    const removeToken = () => {
        setDeletingStatus(RequestStatus.SUBMITTING);

        toolbox
            .getManager()
            .doDelete(`/tokens/${tokenId}`)
            .then(() => {
                setDeletingStatus(RequestStatus.SUBMITTED);
                toolbox.getEventBus().trigger(TokensTableConsts.tableRefreshEvent);
            })
            .catch(() => {
                setDeletingStatus(RequestStatus.ERROR);
            });
    };

    useEffect(() => {
        if (deletingStatus === RequestStatus.SUBMITTED) {
            hideModal();
        }
    }, [deletingStatus]);

    return (
        <>
            <Icon bordered link name="trash" title="Delete token" onClick={showModal} />
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
