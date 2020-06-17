/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { Label } from '../basic';
import Consts from '../../utils/consts';

export default function LicenseTag({ isCommunity, isExpired, isTrial, className = '' }) {
    const labelProps = isCommunity
        ? { content: 'Community' }
        : isExpired
        ? { content: 'Expired' }
        : isTrial
        ? { content: 'Trial' }
        : {};

    const LicenseLabel = props => (
        <Label
            {...props}
            size="large"
            style={{ marginLeft: 15, backgroundColor: '#FFC304', color: '#000000' }}
            className={className}
        />
    );

    const LinkedLicenseLabel = props =>
        !_.isEmpty(props) && (
            <Link to={Consts.LICENSE_PAGE_PATH} className={className}>
                <LicenseLabel {...props} />
            </Link>
        );

    return isCommunity ? <LicenseLabel {...labelProps} /> : <LinkedLicenseLabel {...labelProps} />;
}

LicenseTag.propTypes = {
    isCommunity: PropTypes.bool.isRequired,
    isExpired: PropTypes.bool.isRequired,
    isTrial: PropTypes.bool.isRequired,
    className: PropTypes.string
};

LicenseTag.defaultProps = {
    className: ''
};
