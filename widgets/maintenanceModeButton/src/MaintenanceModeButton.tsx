import type { FunctionComponent } from 'react';

interface MaintenanceModeButtonProps {
    maintenanceMode: 'activating' | 'activated' | 'deactivated';
}

interface MaintenanceResponse {
    status: 'activated' | 'deactivated';
    /* eslint-disable camelcase */
    activated_at: string;
    activation_requested_at: string;
}

export const getMaintenanceModeState = ({
    status,
    activated_at,
    activation_requested_at
}: MaintenanceResponse): MaintenanceModeButtonProps['maintenanceMode'] => {
    if (status === 'activated') {
        return 'activated';
    }

    if (activation_requested_at !== '' && activated_at === '') {
        return 'activating';
    }

    return 'deactivated';
};
/* eslint-enable camelcase */

const MaintenanceModeButton: FunctionComponent<MaintenanceModeButtonProps> = ({ maintenanceMode }) => {
    const [open, showModal, hideModal] = Stage.Hooks.useBoolean();
    const { MaintenanceModeActivationButton, MaintenanceModeModal } = Stage.Shared;

    const activating = maintenanceMode === 'activating';

    return (
        <div title={activating ? Stage.i18n.t('widgets.maintenanceModeButton.activating') : undefined}>
            <MaintenanceModeActivationButton
                activate={maintenanceMode === 'deactivated'}
                disabled={activating}
                onClick={showModal}
            />
            <MaintenanceModeModal show={open} onHide={hideModal} />
        </div>
    );
};
export default MaintenanceModeButton;
