/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { Label } from '../basic';
import Consts from '../../utils/consts';

const labelPropTypes = {
    className: PropTypes.string.isRequired,
    content: PropTypes.string
};
const labelDefaultProps = { content: undefined };

const LicenseLabel = ({ content, className }) => (
    <Label
        content={content}
        size="large"
        style={{ marginLeft: 15, backgroundColor: '#FFC304', color: '#000000' }}
        className={className}
    />
);
LicenseLabel.propTypes = labelPropTypes;
LicenseLabel.defaultProps = labelDefaultProps;

const LinkedLicenseLabel = ({ content, className }) =>
    !_.isEmpty(content) && (
        <Link to={Consts.LICENSE_PAGE_PATH} className={className}>
            <LicenseLabel content={content} className={className} />
        </Link>
    );
LinkedLicenseLabel.propTypes = labelPropTypes;
LinkedLicenseLabel.defaultProps = labelDefaultProps;

export default function LicenseTag({ isCommunity, isExpired, isTrial, className = '' }) {
    const labelContent = isCommunity ? 'Community' : isExpired ? 'Expired' : isTrial ? 'Trial' : undefined;
    const LabelComponent = isCommunity ? LicenseLabel : LinkedLicenseLabel;

    return <LabelComponent content={labelContent} className={className} />;
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
