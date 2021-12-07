import React, { FunctionComponent, useContext } from 'react';
import i18n from 'i18next';
import { useSelector } from 'react-redux';
import builtInLogo from 'cloudify-ui-common/images/logo_color_dark_background.svg';
import styled, { ThemeContext } from 'styled-components';
import { Logo, ProductVersion } from '../basic';
import { ReduxState } from '../../reducers';
import LicenseLabel from '../LicenseLabel';
import { Link } from '../shared';
import Consts from '../../utils/consts';
import { productFont } from '../fonts';

const StyledLink = styled(Link)`
    color: inherit !important;
    &:hover {
        color: inherit !important;
        text-decoration: none !important;
    }
`;

const SideBarHeader: FunctionComponent = () => {
    const productVersion = useSelector((state: ReduxState) => state.manager.version.version);
    const theme = useContext(ThemeContext) || {};

    return (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <div style={{ fontFamily: productFont, display: 'inline-block', maxWidth: 10 }}>
                <LicenseLabel
                    style={{
                        marginLeft: -23,
                        marginRight: -28,
                        width: 55,
                        height: 10,
                        padding: 1,
                        fontSize: 8,
                        lineHeight: 'normal',
                        textAlign: 'center',
                        borderRadius: 'unset',
                        textTransform: 'uppercase',
                        transform: 'rotate(-90deg)'
                    }}
                />
            </div>
            <StyledLink to={Consts.HOME_PAGE_PATH}>
                <Logo url={theme.logoUrl || builtInLogo} style={{ position: null, height: 33, margin: '11px 8px' }} />
                <span
                    style={{
                        letterSpacing: '0.2em',
                        marginRight: '1em',
                        textTransform: 'uppercase',
                        fontFamily: productFont
                    }}
                >
                    {i18n.t('productName')}
                </span>
                v<ProductVersion version={productVersion} style={{ color: 'inherit', marginLeft: '-0.3em' }} />
            </StyledLink>
        </div>
    );
};

export default SideBarHeader;
