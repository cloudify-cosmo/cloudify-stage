import { useEffect, useState } from 'react';
import { translationPath } from './widget.consts';
import { tableRefreshEvent } from './TokensTable.consts';
import { RequestStatus } from './types';
import type { TokensWidget } from './widget.types';

const { Icon, Confirm: DeleteModal } = Stage.Basic;
const { getT } = Stage.Utils;
const { useBoolean } = Stage.Hooks;

const t = getT(translationPath);

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
                toolbox.getEventBus().trigger(tableRefreshEvent);
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
            <Icon bordered link name="trash" title={t('table.buttons.removeToken')} onClick={showModal} />
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
