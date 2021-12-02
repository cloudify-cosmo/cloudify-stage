import React, { FunctionComponent } from 'react';
import i18n from 'i18next';
import { useSelector } from 'react-redux';
import logo from 'cloudify-ui-common/images/logo_color_dark_background.svg';
import { Logo, ProductVersion } from '../basic';
import { ReduxState } from '../../reducers';
import LicenseLabel from '../LicenseLabel';

const SideBarHeader: FunctionComponent = () => {
    const productVersion = useSelector((state: ReduxState) => state.manager.version.version);

    return (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JosefinSans-Bold' }}>
                <div style={{ display: 'inline-block', maxWidth: 10 }}>
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
                <Logo url={logo} style={{ position: null, height: 33, margin: '11px 8px' }} />
                <span
                    style={{
                        letterSpacing: '0.2em',
                        marginRight: '1em',
                        textTransform: 'uppercase'
                    }}
                >
                    {i18n.t('productName')}
                </span>
            </span>
            v<ProductVersion version={productVersion} style={{ color: 'inherit', marginLeft: '-0.3em' }} />
        </div>
    );
};

export default SideBarHeader;
