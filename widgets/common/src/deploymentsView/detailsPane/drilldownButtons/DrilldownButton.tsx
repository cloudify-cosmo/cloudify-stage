import type { FunctionComponent } from 'react';

import { FilterRuleOperators, FilterRuleType } from '../../../filters/types';
import {
    filterRulesContextKey,
    i18nDrillDownPrefix,
    mapOpenContextKey,
    subenvironmentsIcon,
    subservicesIcon
} from '../../common';
import { SubdeploymentStatusIcon } from '../../StatusIcon';
import { tDrillDownButtons } from './common';
import type { SubdeploymentsResult } from './subdeployments-result';

export interface DrilldownButtonProps {
    type: 'environments' | 'services';
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
    deploymentName: string;
    result: SubdeploymentsResult;
    mapOpen: boolean;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const DrilldownButton: FunctionComponent<DrilldownButtonProps> = ({
    type,
    drillDown,
    deploymentName,
    result,
    mapOpen
}) => {
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;

    const drilldownToSubdeployments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            { [filterRulesContextKey]: [deploymentTypeRule[type]], [mapOpenContextKey]: mapOpen },
            `${deploymentName} [${Stage.i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.${type}`)}]`
        );
    };

    const { Button, Icon } = Stage.Basic;

    return (
        <Button
            basic
            color="blue"
            onClick={drilldownToSubdeployments}
            disabled={result.loading || result.count === 0}
            loading={result.loading}
            title={tDrillDownButtons(`${type}.title`)}
        >
            <Icon name={icon} />
            {tDrillDownButtons(`${type}.label`)}
            {!result.loading && (
                <>
                    {' '}
                    ({result.count})
                    <SubdeploymentStatusIcon status={result.status} style={{ marginRight: 0, marginLeft: '0.2em' }} />
                </>
            )}
        </Button>
    );
};
export default DrilldownButton;

const deploymentTypeRule: Record<DrilldownButtonProps['type'], Stage.Common.Filters.Rule> = {
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
