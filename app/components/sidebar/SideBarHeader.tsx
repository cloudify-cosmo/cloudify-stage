import type { FunctionComponent } from 'react';
import React, { useContext } from 'react';
import i18n from 'i18next';
import { useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { ProductVersion } from '../basic';
import type { ReduxState } from '../../reducers';
import LicenseLabel from './LicenseLabel';
import { Link } from '../shared';
import Consts from '../../utils/consts';
import { productFont } from './fonts';
import ProductLogo from '../common/ProductLogo';

const StyledLink = styled(Link)`
    color: ${props => props.color} !important;
    &:hover {
        color: ${props => props.color} !important;
        text-decoration: none !important;
    }
`;

const SideBarHeader: FunctionComponent = () => {
    const productVersion = useSelector((state: ReduxState) => state.manager.version.version)!;
    const theme = useContext(ThemeContext) || {};
    const { showVersionDetails } = theme;

    return (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0, borderBottom: '1px white solid' }}>
            {showVersionDetails && (
                <div style={{ fontFamily: productFont, display: 'inline-block', maxWidth: 10, filter: 'blur(0)' }}>
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
            )}
            <StyledLink color={theme.sidebarTextColor} to={Consts.PAGE_PATH.HOME}>
                <ProductLogo background="dark" style={{ position: undefined, height: 33, margin: '11px 8px' }} />
                <div style={{ display: 'inline', fontSize: '1.5em', verticalAlign: 'middle' }}>
                    <span
                        style={{
                            letterSpacing: '0.1em',
                            marginRight: '0.5em',
                            textTransform: 'uppercase',
                            fontFamily: productFont
                        }}
                    >
                        {i18n.t('productName')}
                    </span>
                    {showVersionDetails && (
                        <>
                            v
                            <ProductVersion
                                version={productVersion}
                                style={{ color: 'inherit', marginLeft: '-0.3em' }}
                            />
                        </>
                    )}
                </div>
            </StyledLink>
        </div>
    );
};

export default SideBarHeader;
