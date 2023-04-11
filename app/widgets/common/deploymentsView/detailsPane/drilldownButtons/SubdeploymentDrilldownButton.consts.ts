import { environmentFilterRule } from '../../../filters/common';
import type { FilterRule } from '../../../filters/types';
import { FilterRuleOperators, FilterRuleType } from '../../../filters/types';
import type { SubdeploymentDrilldownButtonProps } from './SubdeploymentDrilldownButton';

export const deploymentTypeFilterRule: Record<SubdeploymentDrilldownButtonProps['type'], FilterRule> = {
    environments: environmentFilterRule,
    services: {
        type: FilterRuleType.Label,
        key: 'csys-obj-type',
        operator: FilterRuleOperators.IsNot,
        values: ['environment']
    }
};
