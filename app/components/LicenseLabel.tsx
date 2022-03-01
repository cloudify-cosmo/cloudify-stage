import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LabelProps } from 'semantic-ui-react';
import { ReduxState } from '../reducers';
import Consts from '../utils/consts';
import StageUtils from '../utils/stageUtils';
import { Label } from './basic';

const t = StageUtils.getT('sidebar.licenseTag');

export default function LicenseLabel({ style, ...rest }: LabelProps) {
    const isCommunity = useSelector((state: ReduxState) => state.manager.version.edition === Consts.EDITION.COMMUNITY);
    const license = useSelector((state: ReduxState) => state.manager.license);

    const licenseLabelKey = useMemo(() => {
        if (isCommunity) {
            return 'community';
        }

        const isExpired = license.status === Consts.LICENSE.EXPIRED;
        if (isExpired) {
            return 'expired';
        }

        const isTrial = license.data?.trial;
        if (isTrial) {
            return 'trial';
        }

        return null;
    }, [license, isCommunity]);

    if (!licenseLabelKey) {
        return null;
    }

    const labelComponent = (
        <Label
            style={{
                backgroundColor: '#FFC304',
                color: '#000000',
                ...style
            }}
            {...rest}
        >
            {t(licenseLabelKey)}
        </Label>
    );

    if (isCommunity) {
        return labelComponent;
    }

    return <Link to={Consts.LICENSE_PAGE_PATH}>{labelComponent}</Link>;
}
