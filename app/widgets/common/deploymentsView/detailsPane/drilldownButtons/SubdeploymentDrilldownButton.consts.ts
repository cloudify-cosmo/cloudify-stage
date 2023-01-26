import type { FilterRule } from '../../../filters/types';
import type { SubdeploymentDrilldownButtonProps } from './SubdeploymentDrilldownButton';
import { FilterRuleOperators, FilterRuleType } from '../../../filters/types';

export const deploymentTypeFilterRule: Record<SubdeploymentDrilldownButtonProps['type'], FilterRule> = {
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
