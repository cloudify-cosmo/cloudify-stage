import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import i18n from 'i18next';
import {
    filterRulesContextKey,
    i18nDrillDownPrefix,
    mapOpenContextKey,
    subenvironmentsIcon,
    subservicesIcon
} from '../../common';
import { SubdeploymentStatusIcon } from '../../StatusIcon';
import { shouldDisplaySubdeploymentButton, tDrillDownButtons } from './common';
import DrilldownButton from './DrilldownButton';
import type { LoadedSubdeploymentsResult, SubdeploymentsResult } from './subdeployments-result';
import { Icon } from '../../../../../components/basic';
import { deploymentTypeFilterRule } from './SubdeploymentDrilldownButton.consts';

export interface SubdeploymentDrilldownButtonProps {
    type: 'environments' | 'services';
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
    deploymentName: string;
    result: SubdeploymentsResult;
    mapOpen: boolean;
}

const SubdeploymentDrilldownButton: FunctionComponent<SubdeploymentDrilldownButtonProps> = ({
    type,
    drillDown,
    deploymentName,
    result,
    mapOpen
}) => {
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;
    const shouldBeDisplayed = useMemo(() => shouldDisplaySubdeploymentButton(result), [result]);

    const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

    const drilldownToSubdeployments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            { [filterRulesContextKey]: [deploymentTypeFilterRule[type]], [mapOpenContextKey]: mapOpen },
            `${deploymentName} [${i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.${type}`)}]`
        );
    };

    return (
        <>
            {shouldBeDisplayed && (
                <DrilldownButton onClick={drilldownToSubdeployments} title={tDrillDownButtons(`${type}.title`)}>
                    <Icon name={icon} />
                    {tDrillDownButtons(`${type}.label`)} ({(result as LoadedSubdeploymentsResult).count})
                    <SubdeploymentStatusIcon
                        status={(result as LoadedSubdeploymentsResult).status}
                        style={{ marginRight: 0, marginLeft: '0.2em' }}
                    />
                </DrilldownButton>
            )}
        </>
    );
};

export default SubdeploymentDrilldownButton;
