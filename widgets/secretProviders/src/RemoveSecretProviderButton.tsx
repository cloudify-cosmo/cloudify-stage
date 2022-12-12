import { useEffect, useState } from 'react';
import { tableRefreshEvent, translateSecretProviders } from './SecretProvidersTable.consts';
import { RequestStatus } from './types';
import type { SecretProvidersWidget } from './widget.types';

const { Icon, Confirm: DeleteModal } = Stage.Basic;

const { useBoolean } = Stage.Hooks;

interface RemoveSecretProviderButtonProps {
    secretProvider: SecretProvidersWidget.DataItem;
    toolbox: Stage.Types.Toolbox;
}

const RemoveSecretProviderButton = ({ secretProvider, toolbox }: RemoveSecretProviderButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();
    const [deletingStatus, setDeletingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const deleteModalContent = translateSecretProviders('deleteModal.content', {
        secretProviderId: secretProvider.id
    });

    const removeSecretProvider = () => {
        setDeletingStatus(RequestStatus.SUBMITTING);

        toolbox
            .getManager()
            .doDelete(`/secrets-providers/${secretProvider.id}`)
            .then(() => {
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
            <Icon
                link
                name="trash"
                title={translateSecretProviders('table.buttons.removeSecretProvider')}
                onClick={showModal}
            />
            {isModalVisible && (
                <DeleteModal open content={deleteModalContent} onCancel={hideModal} onConfirm={removeSecretProvider} />
            )}
        </>
    );
};

export default RemoveSecretProviderButton;
