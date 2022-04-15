import { useEffect, useState } from 'react';
import { widgetTranslationPath } from './consts';
import { TokensTableConsts } from './TokensTable.consts';
import { RequestStatus } from './types';
import type { TokensWidget } from './widget.types';

const {
    Basic: { Icon, Confirm: DeleteModal },
    Utils: { getT },
    Hooks: { useBoolean }
} = Stage;

const t = getT(widgetTranslationPath);

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
            <Icon bordered link name="trash" title={t('buttons.removeToken')} onClick={showModal} />
            {isModalVisible && (
                <DeleteModal
                    open
                    content={t('deleteModal.content', {
                        tokenId
                    })}
                    onCancel={hideModal}
                    onConfirm={removeToken}
                />
            )}
        </>
    );
};

export default RemoveTokenButton;
