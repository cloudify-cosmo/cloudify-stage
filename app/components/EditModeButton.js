import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './basic';
import './EditModeButton.css';

export default function EditModeButton({ className, ...rest }) {
    return <Button className={`editModeButton ${className}`} {...rest} />;
}

EditModeButton.propTypes = {
    className: PropTypes.string
};

EditModeButton.defaultProps = {
    className: ''
};
