import React, { FunctionComponent, useMemo } from 'react';
import i18n from 'i18next';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import logo from 'cloudify-ui-common/images/logo_color_dark_background.svg';
import { Logo, ProductVersion } from '../basic';
import { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';
import StageUtils from '../../utils/stageUtils';

const LicenseLabel = ({ content }: { content: string }) => (
    <div
        style={{
            backgroundColor: '#FFC304',
            color: '#000000',
            textAlign: 'center',
            transform: 'rotate(-90deg)',
            position: 'absolute',
            top: 23,
            left: -23,
            width: 55,
            textTransform: 'uppercase',
            fontFamily: 'JosefinSans-Bold',
            height: 10,
            paddingTop: 2,
            fontSize: 8,
            lineHeight: 'normal'
        }}
    >
        {content}
    </div>
);

const LicenseLabelWrapper = ({ content, linked }: { content: string; linked: boolean }) => {
    if (!_.isEmpty(content)) {
        if (linked) {
            return (
                <Link to={Consts.LICENSE_PAGE_PATH}>
                    <LicenseLabel content={content} />
                </Link>
            );
        }
        return (
            <span>
                <LicenseLabel content={content} />
            </span>
        );
    }
    return null;
};

const t = StageUtils.getT('sidebar.licenseTag');

const SideBarHeader: FunctionComponent = () => {
    const isCommunity = useSelector(
        (state: ReduxState) => (state.manager.version.edition ?? Consts.EDITION.PREMIUM) === Consts.EDITION.COMMUNITY
    );
    const license = useSelector((state: ReduxState) => state.manager.license);

    const licenseLabelKey = useMemo(() => {
        const isExpired = license.status === Consts.LICENSE.EXPIRED;
        const isTrial = license.data?.trial;

        if (isCommunity) {
            return 'community';
        }
        if (isExpired) {
            return 'expired';
        }
        if (isTrial) {
            return 'trial';
        }

        return null;
    }, [license, isCommunity]);

    const productVersion = useSelector((state: ReduxState) => state.manager.version.version);

    return (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Logo url={logo} style={{ top: 6, left: licenseLabelKey ? 3 : -3 }} />
            <span
                style={{
                    fontFamily: 'JosefinSans-Bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginRight: '1em'
                }}
            >
                {i18n.t('productName')}
            </span>
            v<ProductVersion version={productVersion} style={{ color: 'inherit', marginLeft: '-0.3em' }} />
            {licenseLabelKey && <LicenseLabelWrapper content={t(licenseLabelKey)} linked={!isCommunity} />}
        </div>
    );
};

export default SideBarHeader;
