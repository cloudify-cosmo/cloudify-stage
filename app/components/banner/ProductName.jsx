/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';

export default function ProductName({ className }) {
    return (
        <span style={{ color: 'white', verticalAlign: 'middle' }} className={className}>
            {i18n.t('productName')}
        </span>
    );
}

ProductName.propTypes = {
    className: PropTypes.string
};

ProductName.defaultProps = {
    className: ''
};
