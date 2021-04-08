import { camelCase } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

import { i18nPrefix } from './consts';
import { RuleType, LabelsRuleOperator, AttributesRuleOperator } from './types';
import type { RuleOperator } from './types';

interface RuleOperatorDropdownProps {
    ruleType: RuleType;
    onChange: (value: RuleOperator) => void;
    operator: RuleOperator;
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
        const operators = Object.values(ruleType === RuleType.Label ? LabelsRuleOperator : AttributesRuleOperator);
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
            onChange={(_event, { value }) => onChange(value as RuleOperator)}
            value={operator}
        />
    );
};
export default RuleOperatorDropdown;
