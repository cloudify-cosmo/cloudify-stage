import type { FunctionComponent } from 'react';

const operators = [
    { name: 'any_of', label: 'is one of' },
    { name: 'not_any_of', label: 'is not one of' },
    { name: 'is_null', label: 'key is not' },
    { name: 'is_not_null', label: 'key is' },
    { name: 'contain', label: 'contains' },
    { name: 'not_contain', label: 'does not contain' },
    { name: 'start_with', label: 'starts with' },
    { name: 'end_with', label: 'ends with' }
];

const RuleOperatorDropdown: FunctionComponent = () => {
    const { Dropdown } = Stage.Basic;
    const operatorsOptions = _.map(operators, operator => ({ text: operator.label, value: operator.name }));

    return <Dropdown search selection name="ruleOperator" options={operatorsOptions} />;
};
export default RuleOperatorDropdown;
