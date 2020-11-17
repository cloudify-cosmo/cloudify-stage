import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { HeaderBanner } from 'cloudify-ui-components';
import i18n from 'i18next';
import Consts from '../../utils/consts';
import LicenseTag from './LicenseTag';

function Banner({ className }) {
    const isCommunity = useSelector(
        state => _.get(state, 'manager.version.edition', Consts.EDITION.PREMIUM) === Consts.EDITION.COMMUNITY
    );
    const licenseEdition = useSelector(state => _.get(state, 'manager.license.data.license_edition', ''));
    const productVersion = useSelector(state => _.get(state, 'manager.version.version', ''));
    const showVersionDetails = useSelector(state => _.get(state, 'config.app.whiteLabel.showVersionDetails', true));
    const logoUrl = useSelector(state => _.get(state, 'config.app.whiteLabel.logoUrl', ''));

    const productName = i18n.t('productName');

    return (
        <>
            <Link to={Consts.HOME_PAGE_PATH} className={className}>
                <HeaderBanner
                    isCommunity={isCommunity}
                    licenseEdition={licenseEdition}
                    logoUrl={logoUrl}
                    productName={productName}
                    productVersion={productVersion}
                    showVersionDetails={!isCommunity && showVersionDetails}
                />
            </Link>
            {showVersionDetails && <LicenseTag className={className} />}
        </>
    );
}

Banner.propTypes = {
    className: PropTypes.string
};

Banner.defaultProps = {
    className: ''
};

const StyledBanner = styled(Banner)`
    @media (max-width: 800px) {
        ${props => (props.hideOnSmallScreen ? 'display: none !important' : '')};
    }
`;

StyledBanner.propTypes = {
    hideOnSmallScreen: PropTypes.bool
};

StyledBanner.defaultProps = {
    hideOnSmallScreen: true
};

export default StyledBanner;
