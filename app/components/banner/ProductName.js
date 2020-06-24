/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';
import React from 'react';

export default function ProductName({ name, className }) {
    return (
        <span style={{ color: 'white', verticalAlign: 'middle' }} className={className}>
            {name}
        </span>
    );
}

ProductName.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string
};

ProductName.defaultProps = {
    className: ''
};
