import type { Manager } from 'cloudify-ui-components/toolbox';
import { translateSecretProviders } from './widget.utils';
import type { SecretProvidersWidget } from './widget.types';
import UpdateSecretProviderModal from './UpdateSecretProviderModal';

const { useBoolean } = Stage.Hooks;
const { Icon } = Stage.Basic;
interface UpdateSecretProviderButtonProps {
    secretProvider: SecretProvidersWidget.DataItem;
    manager: Manager;
    onSubmit: () => void;
}

const UpdateSecretProviderButton = ({ secretProvider, manager, onSubmit }: UpdateSecretProviderButtonProps) => {
    const [isUpdateModalOpen, openUpdateModal, closeUpdateModal] = useBoolean();

    return (
        <>
            <Icon
                link
                name="edit"
                title={translateSecretProviders('table.buttons.updateSecretProvider')}
                onClick={openUpdateModal}
            />
            {isUpdateModalOpen && (
                <UpdateSecretProviderModal
                    manager={manager}
                    secretProvider={secretProvider}
                    onClose={closeUpdateModal}
                    onSubmit={onSubmit}
                />
            )}
        </>
    );
};

export default UpdateSecretProviderButton;
