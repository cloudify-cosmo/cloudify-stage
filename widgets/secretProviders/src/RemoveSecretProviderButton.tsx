import { translateSecretProviders } from './widget.utils';
import { tableRefreshEvent } from './widget.consts';
import type { SecretProvidersWidget } from './widget.types';

const { Icon, Modal, Button, ErrorMessage } = Stage.Basic;

const { useBoolean, useResettableState } = Stage.Hooks;

interface RemoveSecretProviderButtonProps {
    secretProvider: SecretProvidersWidget.DataItem;
    toolbox: Stage.Types.Toolbox;
}

const RemoveSecretProviderButton = ({ secretProvider, toolbox }: RemoveSecretProviderButtonProps) => {
    const deleteModalContent = translateSecretProviders('deleteModal.content', { secretProviderId: secretProvider.id });
    const warningModalContent = translateSecretProviders('warningModal.content', {
        secretProviderId: secretProvider.id
    });
    const [error, setError, clearError] = useResettableState<string | null>(null);

    const [isWarningModalOpen, openWarningModal, closeWarningModal] = useBoolean();
    const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBoolean();

    const checkSecretProvider = () => {
        clearError();

        toolbox
            .getManager()
            .doGet(`/secrets?_include=provider_name`)
            .then(secrets => {
                if (secrets.items.some((secret: any) => secret.provider_name === secretProvider.name)) {
                    openWarningModal();
                } else {
                    openDeleteModal();
                }
            })
            .catch(err => {
                log.error(err);
                setError(err);
            });
    };

    const deleteSecretProvider = () => {
        toolbox
            .getManager()
            .doDelete(`/secrets-providers/${secretProvider.id}`)
            .then(() => {
                toolbox.getEventBus().trigger(tableRefreshEvent);
                closeDeleteModal();
            })
            .catch(err => {
                log.error(err);
                setError(err);
            });
    };

    const ErrorMsg = <ErrorMessage error={error} onDismiss={clearError} />;

    const DeleteSecretProviderModal = (
        <Modal open onConfirm={deleteSecretProvider} onCancel={closeDeleteModal}>
            <Modal.Header style={{ border: 'none' }}>{deleteModalContent}</Modal.Header>
            {error && <Modal.Content>{ErrorMsg}</Modal.Content>}
            <Modal.Actions>
                <Button content={translateSecretProviders('deleteModal.buttons.cancel')} onClick={closeDeleteModal} />
                <Button
                    content={translateSecretProviders('deleteModal.buttons.confirm')}
                    onClick={deleteSecretProvider}
                    primary
                />
            </Modal.Actions>
        </Modal>
    );

    const WarningSecretProviderModal = (
        <Modal open onClose={closeWarningModal}>
            <Modal.Header style={{ border: 'none' }}> {warningModalContent}</Modal.Header>
            {error && <Modal.Content>{ErrorMsg}</Modal.Content>}
            <Modal.Actions>
                <Button content={translateSecretProviders('warningModal.buttons.cancel')} onClick={closeWarningModal} />
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            <Icon
                link
                name="trash"
                title={translateSecretProviders('table.buttons.removeSecretProvider')}
                onClick={checkSecretProvider}
            />
            {isDeleteModalOpen && DeleteSecretProviderModal}
            {isWarningModalOpen && WarningSecretProviderModal}
        </>
    );
};

export default RemoveSecretProviderButton;
