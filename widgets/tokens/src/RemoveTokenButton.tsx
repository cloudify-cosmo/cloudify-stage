import { useEffect, useMemo, useState } from 'react';
import { translateWidget as translate } from './widget.utils';
import { tableRefreshEvent } from './TokensTable.consts';
import { RequestStatus } from './types';
import type { TokensWidget } from './widget.types';

const { Icon, Confirm: DeleteModal } = Stage.Basic;
const { useBoolean } = Stage.Hooks;

interface RemoveTokenButtonProps {
    token: TokensWidget.DataItem;
    toolbox: Stage.Types.Toolbox;
}

const RemoveTokenButton = ({ token, toolbox }: RemoveTokenButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();
    const [deletingStatus, setDeletingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const deleteModalContent = useMemo(() => {
        const translationSuffix = token.description ? 'withDescription' : 'withoutDescription';
        return translate(`deleteModal.content.${translationSuffix}`, {
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
            <Icon link name="trash" title={translate('table.buttons.removeToken')} onClick={showModal} />
            {isModalVisible && (
                <DeleteModal open content={deleteModalContent} onCancel={hideModal} onConfirm={removeToken} />
            )}
        </>
    );
};

export default RemoveTokenButton;
