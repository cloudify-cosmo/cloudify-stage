import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './basic';
import './EditModeButton.css';

export default function EditModeButton({ className, icon, labelPosition, content, style, onClick }) {
    return (
        <Button
            className={`editModeButton ${className}`}
            icon={icon}
            labelPosition={labelPosition}
            basic
            content={content}
            style={style}
            onClick={onClick}
        />
    );
}

EditModeButton.propTypes = {
    className: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.string.isRequired,
    labelPosition: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.shape({})
};

EditModeButton.defaultProps = {
    content: undefined,
    className: '',
    labelPosition: undefined,
    onClick: undefined,
    style: undefined
};
