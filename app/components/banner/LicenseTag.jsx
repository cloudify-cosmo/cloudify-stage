import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
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
        style={{ marginLeft: 15, backgroundColor: '#FFC304', color: '#000000', verticalAlign: 'middle' }}
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

export default function LicenseTag({ className = '' }) {
    const isCommunity = useSelector(
        state => _.get(state, 'manager.version.edition', Consts.EDITION.PREMIUM) === Consts.EDITION.COMMUNITY
    );
    const isExpired = useSelector(
        state => _.get(state, 'manager.license.status', Consts.LICENSE.EMPTY) === Consts.LICENSE.EXPIRED
    );
    const isTrial = useSelector(state => _.get(state, 'manager.license.data.trial', false));

    const LabelComponent = isCommunity ? LicenseLabel : LinkedLicenseLabel;
    let labelContent;
    if (isCommunity) {
        labelContent = 'Community';
    } else if (isExpired) {
        labelContent = 'Expired';
    } else if (isTrial) {
        labelContent = 'Trial';
    } else {
        labelContent = undefined;
    }

    return <LabelComponent content={labelContent} className={className} />;
}
LicenseTag.propTypes = {
    className: PropTypes.string
};

LicenseTag.defaultProps = {
    className: ''
};
