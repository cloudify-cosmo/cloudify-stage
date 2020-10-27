/**
 * Created by jakubniezgoda on 24/05/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../basic';

export default function MaintenanceModeActivationButton({ activate, onClick }) {
    const content = activate ? 'Activate Maintenance Mode' : 'Dectivate Maintenance Mode';

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
