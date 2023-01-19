import type { ButtonProps } from 'semantic-ui-react';
import React from 'react';
import i18n from 'i18next';
import { Button } from '../basic';

interface MaintenanceModeActivationButtonProps {
    activate: boolean;
    onClick: ButtonProps['onClick'];
    disabled?: boolean;
}

export default function MaintenanceModeActivationButton({
    activate,
    onClick,
    disabled = false
}: MaintenanceModeActivationButtonProps) {
    const content = activate ? i18n.t('maintenanceMode.activate') : i18n.t('maintenanceMode.deactivate');

    return (
        <Button
            color="orange"
            icon="doctor"
            content={content}
            className="widgetButton"
            labelPosition="left"
            onClick={onClick}
            disabled={disabled}
        />
    );
}
