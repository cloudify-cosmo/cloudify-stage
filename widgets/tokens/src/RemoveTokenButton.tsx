import { useEffect, useMemo, useState } from 'react';
import { translationPath } from './widget.consts';
import { tableRefreshEvent } from './TokensTable.consts';
import { RequestStatus } from './types';
import type { TokensWidget } from './widget.types';

const { Icon, Confirm: DeleteModal } = Stage.Basic;
const { getT } = Stage.Utils;
const { useBoolean } = Stage.Hooks;

const t = getT(translationPath);

interface RemoveTokenButtonProps {
    token: TokensWidget.DataItem;
    toolbox: Stage.Types.Toolbox;
}

const RemoveTokenButton = ({ token, toolbox }: RemoveTokenButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();
    const [deletingStatus, setDeletingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const deleteModalContent = useMemo(() => {
        const translationSuffix = token.description ? 'withDescription' : 'withoutDescription';
        return t(`deleteModal.content.${translationSuffix}`, {
            tokenId: token.id,
            tokenDescription: token.description
        });
    }, [token.description]);

    const removeToken = () => {
        setDeletingStatus(RequestStatus.SUBMITTING);

        toolbox
            .getManager()
            .doDelete(`/tokens/${token.id}`)
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
            <Icon link name="trash" title={t('table.buttons.removeToken')} onClick={showModal} />
            {isModalVisible && (
                <DeleteModal open content={deleteModalContent} onCancel={hideModal} onConfirm={removeToken} />
            )}
        </>
    );
};

export default RemoveTokenButton;
