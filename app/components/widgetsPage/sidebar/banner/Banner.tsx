import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { HeaderBanner } from 'cloudify-ui-components';
import i18n from 'i18next';
import Consts from '../../../../utils/consts';
import LicenseLabel from '../LicenseLabel';
import type { ReduxState } from '../../../../reducers';

interface BannerProps {
    className?: string;
}

function Banner({ className = '' }: BannerProps) {
    const edition = useSelector((state: ReduxState) => state.manager.version.edition ?? Consts.EDITION.PREMIUM);
    const isCommunity = edition === Consts.EDITION.COMMUNITY;
    const licenseEdition = useSelector((state: ReduxState) => state.manager.license.data?.license_edition ?? '');
    const productVersion = useSelector((state: ReduxState) => state.manager.version.version ?? '');
    const theme = useContext(ThemeContext) || {};
    const showVersionDetails = _.isBoolean(theme.showVersionDetails) ? theme.showVersionDetails : true;

    const productName = i18n.t('productName');

    return (
        <>
            <Link to={Consts.PAGE_PATH.HOME} className={className}>
                <HeaderBanner
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

interface StyledBannerProps {
    hideOnSmallScreen?: boolean;
}

const StyledBanner = styled(Banner)<StyledBannerProps>`
    @media (max-width: 600px) {
        ${props => (props.hideOnSmallScreen ? 'display: none !important' : '')};
    }
`;

export default StyledBanner;
