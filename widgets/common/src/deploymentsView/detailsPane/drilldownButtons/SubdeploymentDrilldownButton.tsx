import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { FilterRule, FilterRuleOperators, FilterRuleType } from '../../../filters/types';
import {
    filterRulesContextKey,
    i18nDrillDownPrefix,
    mapOpenContextKey,
    subenvironmentsIcon,
    subservicesIcon
} from '../../common';
import { SubdeploymentStatusIcon } from '../../StatusIcon';
import { tDrillDownButtons, shouldDisplaySubdeploymentButton } from './common';
import DrilldownButton from './DrilldownButton';
import type { LoadedSubdeploymentsResult, SubdeploymentsResult } from './subdeployments-result';

export interface SubdeploymentDrilldownButtonProps {
    type: 'environments' | 'services';
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
    deploymentName: string;
    result: SubdeploymentsResult;
    mapOpen: boolean;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const { Icon } = Stage.Basic;

const SubdeploymentDrilldownButton: FunctionComponent<SubdeploymentDrilldownButtonProps> = ({
    type,
    drillDown,
    deploymentName,
    result,
    mapOpen
}) => {
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;
    const shouldBeDisplayed = useMemo(() => shouldDisplaySubdeploymentButton(result), [result]);

    const drilldownToSubdeployments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            { [filterRulesContextKey]: [deploymentTypeRule[type]], [mapOpenContextKey]: mapOpen },
            `${deploymentName} [${Stage.i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.${type}`)}]`
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

const deploymentTypeRule: Record<SubdeploymentDrilldownButtonProps['type'], FilterRule> = {
    environments: {
        type: FilterRuleType.Label,
        key: 'csys-obj-type',
        operator: FilterRuleOperators.AnyOf,
        values: ['environment']
    },
    services: {
        type: FilterRuleType.Label,
        key: 'csys-obj-type',
        operator: FilterRuleOperators.IsNot,
        values: ['environment']
    }
};
