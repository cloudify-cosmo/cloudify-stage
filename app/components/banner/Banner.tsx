// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { HeaderBanner } from 'cloudify-ui-components';
import i18n from 'i18next';
import Consts from '../../utils/consts';
import LicenseLabel from '../LicenseLabel';

function Banner({ className }) {
    const isCommunity = useSelector(
        state => _.get(state, 'manager.version.edition', Consts.EDITION.PREMIUM) === Consts.EDITION.COMMUNITY
    );
    const licenseEdition = useSelector(state => _.get(state, 'manager.license.data.license_edition', ''));
    const productVersion = useSelector(state => _.get(state, 'manager.version.version', ''));
    const theme = useContext(ThemeContext) || {};
    const showVersionDetails = _.isBoolean(theme.showVersionDetails) ? theme.showVersionDetails : true;

    const productName = i18n.t('productName');

    return (
        <>
            <Link to={Consts.HOME_PAGE_PATH} className={className}>
                <HeaderBanner
                    isCommunity={isCommunity}
                    licenseEdition={licenseEdition}
                    productName={productName}
                    productVersion={productVersion}
                    showVersionDetails={!isCommunity && showVersionDetails}
                />
            </Link>
            {showVersionDetails && <LicenseLabel size="large" style={{ marginLeft: 15 }} />}
        </>
    );
}

Banner.propTypes = {
    className: PropTypes.string
};

Banner.defaultProps = {
    className: ''
};

interface StyledBannerProps {
    hideOnSmallScreen?: boolean;
}

const StyledBanner = styled(Banner)<StyledBannerProps>`
    @media (max-width: 600px) {
        ${props => (props.hideOnSmallScreen ? 'display: none !important' : '')};
    }
`;

export default StyledBanner;
