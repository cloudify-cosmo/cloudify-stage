import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { Logo as CommonLogo } from '../basic';

export default function Logo({ style }) {
    const url = useSelector(state => _.get(state, 'config.app.whiteLabel.logoUrl', ''));
    return <CommonLogo style={style} url={url} />;
}

Logo.propTypes = {
    style: PropTypes.shape({})
};
Logo.defaultProps = {
    style: {}
};
