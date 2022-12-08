import { useEffect, useState } from 'react';
import { tableRefreshEvent } from './SecretProvidersTable.consts';
import { RequestStatus } from './types';
import type { SecretProvidersWidget } from './widget.types';

const { Icon, Confirm: DeleteModal } = Stage.Basic;

const { useBoolean } = Stage.Hooks;

const t = Stage.Utils.getT(`widgets.secretProviders`);

interface RemoveSecretProviderButtonProps {
    secretProvider: SecretProvidersWidget.DataItem;
    toolbox: Stage.Types.Toolbox;
}

const RemoveSecretProviderButton = ({ secretProvider, toolbox }: RemoveSecretProviderButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();
    const [deletingStatus, setDeletingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const deleteModalContent = t('deleteModal.content', {
        secretProviderId: secretProvider.id
    });

    const removeSecretProvider = () => {
        setDeletingStatus(RequestStatus.SUBMITTING);

        toolbox
            .getManager()
            .doDelete(`/secrets-providers/${secretProvider.id}`)
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
            <Icon bordered link name="trash" title={t('table.buttons.removeSecretProvider')} onClick={showModal} />
            {isModalVisible && (
                <DeleteModal open content={deleteModalContent} onCancel={hideModal} onConfirm={removeSecretProvider} />
            )}
        </>
    );
};

export default RemoveSecretProviderButton;
