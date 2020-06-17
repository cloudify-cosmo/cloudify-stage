/**
 * Created by kinneretzin on 01/09/2016.
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from './basic/index';

export default function EditWidgetIcon({ onShowConfig }) {
    return (
        <Icon
            name="setting"
            link
            size="small"
            className="editWidgetIcon"
            onClick={event => {
                event.stopPropagation();
                onShowConfig();
            }}
        />
    );
}

EditWidgetIcon.propTypes = {
    onShowConfig: PropTypes.func.isRequired
};
