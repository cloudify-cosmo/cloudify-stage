import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Label } from '../basic';
import Consts from '../../utils/consts';

const LicenseLabel = ({ content, className }) => (
    <Label
        content={content}
        size="large"
        style={{ marginLeft: 15, backgroundColor: '#FFC304', color: '#000000', verticalAlign: 'middle' }}
        className={className}
    />
);
LicenseLabel.propTypes = {
    className: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
};

const LicenseLabelWrapper = ({ content, className, linked }) => {
    if (!_.isEmpty(content)) {
        if (linked) {
            return (
                <Link to={Consts.LICENSE_PAGE_PATH} className={className}>
                    <LicenseLabel content={content} className={className} />
                </Link>
            );
        }
        return (
            <span>
                <LicenseLabel content={content} className={className} />
            </span>
        );
    }
    return null;
};
LicenseLabelWrapper.propTypes = {
    className: PropTypes.string.isRequired,
    linked: PropTypes.bool.isRequired,
    content: PropTypes.string
};
LicenseLabelWrapper.defaultProps = {
    content: undefined
};

export default function LicenseTag({ className = '' }) {
    const isCommunity = useSelector(
        state => _.get(state, 'manager.version.edition', Consts.EDITION.PREMIUM) === Consts.EDITION.COMMUNITY
    );
    const isExpired = useSelector(
        state => _.get(state, 'manager.license.status', Consts.LICENSE.EMPTY) === Consts.LICENSE.EXPIRED
    );
    const isTrial = useSelector(state => _.get(state, 'manager.license.data.trial', false));

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

    return <LicenseLabelWrapper content={labelContent} className={className} linked={!isCommunity} />;
}
LicenseTag.propTypes = {
    className: PropTypes.string
};

LicenseTag.defaultProps = {
    className: ''
};
