import { translateSecretProviders } from './SecretProvidersTable.utils';
import { tableRefreshEvent } from './SecretProvidersTable.consts';
import type { SecretProvidersWidget } from './widget.types';

const { Icon, Confirm: DeleteModal } = Stage.Basic;

const { useBoolean } = Stage.Hooks;

interface RemoveSecretProviderButtonProps {
    secretProvider: SecretProvidersWidget.DataItem;
    toolbox: Stage.Types.Toolbox;
}

const RemoveSecretProviderButton = ({ secretProvider, toolbox }: RemoveSecretProviderButtonProps) => {
    const [isModalVisible, showModal, hideModal] = useBoolean();
    const deleteModalContent = translateSecretProviders('deleteModal.content', {
        secretProviderId: secretProvider.id
    });

    const removeSecretProvider = () => {
        toolbox
            .getManager()
            .doDelete(`/secrets-providers/${secretProvider.id}`)
            .then(() => {
                toolbox.getEventBus().trigger(tableRefreshEvent);
                hideModal();
            })
            .catch(err => {
                log.error(err);
            });
    };

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
