import { camelCase } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

import { i18nPrefix } from './consts';
import { FilterRuleRowType, LabelsFilterRuleOperators, AttributesFilterRuleOperators } from './types';
import type { FilterRuleOperator } from './types';

interface RuleOperatorDropdownProps {
    ruleType: FilterRuleRowType;
    onChange: (value: FilterRuleOperator) => void;
    operator: FilterRuleOperator;
}

function getDropdownOptions(operators: string[]) {
    const { i18n } = Stage;
    return operators.map(
        (operator): DropdownItemProps => ({
            text: i18n.t(`${i18nPrefix}.operatorsLabels.${camelCase(operator as string)}`),
            value: operator
        })
    );
}

const RuleOperatorDropdown: FunctionComponent<RuleOperatorDropdownProps> = ({ ruleType, onChange, operator }) => {
    const { Dropdown } = Stage.Basic;

    const [options, setOptions] = useState([] as DropdownItemProps[]);

    useEffect(() => {
        const operators = Object.values(
            ruleType === FilterRuleRowType.Label ? LabelsFilterRuleOperators : AttributesFilterRuleOperators
        );
        const dropdownOptions = getDropdownOptions(operators);

        setOptions(dropdownOptions);
    }, [ruleType]);

    return (
        <Dropdown
            clearable={false}
            search
            selection
            selectOnNavigation
            name="ruleOperator"
            options={options}
            onChange={(_event, { value }) => onChange(value as FilterRuleOperator)}
            value={operator}
        />
    );
};
export default RuleOperatorDropdown;
