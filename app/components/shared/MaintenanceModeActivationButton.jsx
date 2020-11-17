/**
 * Created by jakubniezgoda on 24/05/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { Button } from '../basic';

export default function MaintenanceModeActivationButton({ activate, onClick }) {
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
        />
    );
}

MaintenanceModeActivationButton.propTypes = {
    activate: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
