// @ts-nocheck File not migrated fully to TS
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from './basic/index';

export default function EditWidgetIcon({ onShowConfig, size }) {
    return (
        <Icon
            name="setting"
            link
            size={size}
            className="editWidgetIcon"
            onClick={event => {
                event.stopPropagation();
                onShowConfig();
            }}
        />
    );
}

EditWidgetIcon.propTypes = {
    onShowConfig: PropTypes.func.isRequired,
    size: PropTypes.string
};

EditWidgetIcon.defaultProps = {
    // Use the default icon size
    size: undefined
};
