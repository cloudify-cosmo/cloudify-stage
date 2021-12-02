// @ts-nocheck File not migrated fully to TS

import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { Button } from '../basic';

export default function MaintenanceModeActivationButton({ activate, onClick, disabled }) {
    const content = activate
        ? i18n.t('maintenanceMode.activate', 'Activate Maintenance Mode')
        : i18n.t('maintenanceMode.deactivate', 'Deactivate Maintenance Mode');

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

MaintenanceModeActivationButton.propTypes = {
    activate: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

MaintenanceModeActivationButton.defaultProps = {
    disabled: false
};
