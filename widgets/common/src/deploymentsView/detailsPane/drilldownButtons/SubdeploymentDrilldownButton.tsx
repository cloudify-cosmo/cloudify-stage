import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import type { FilterRule } from '../../../filters/types';
import { FilterRuleOperators, FilterRuleType } from '../../../filters/types';
import {
    filterRulesContextKey,
    parentDeploymentIdContextKey,
    i18nDrillDownPrefix,
    mapOpenContextKey,
    subenvironmentsIcon,
    subservicesIcon
} from '../../common';
import { SubdeploymentStatusIcon } from '../../StatusIcon';
import { tDrillDownButtons, shouldDisplaySubdeploymentButton } from './common';
import DrilldownButton from './DrilldownButton';
import type { LoadedSubdeploymentsResult, SubdeploymentsResult } from './subdeployments-result';

const { Icon } = Stage.Basic;

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';
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

export interface SubdeploymentDrilldownButtonProps {
    type: 'environments' | 'services';
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
    deploymentName: string;
    result: SubdeploymentsResult;
    mapOpen: boolean;
    deploymentId: string;
}

const SubdeploymentDrilldownButton: FunctionComponent<SubdeploymentDrilldownButtonProps> = ({
    type,
    drillDown,
    deploymentName,
    result,
    mapOpen,
    deploymentId
}) => {
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;
    const shouldBeDisplayed = useMemo(() => shouldDisplaySubdeploymentButton(result), [result]);

    const drilldownToSubdeployments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            {
                [filterRulesContextKey]: [deploymentTypeRule[type]],
                [mapOpenContextKey]: mapOpen,
                [parentDeploymentIdContextKey]: deploymentId
            },
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
