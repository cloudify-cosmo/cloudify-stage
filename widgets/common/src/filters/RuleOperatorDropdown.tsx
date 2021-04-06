import type { FunctionComponent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

const { i18n } = Stage;
const i18nPrefix = 'widgets.common.filters.form.operatorsLabels';
const operators = [
    'any_of',
    'not_any_of',
    'is_null',
    'is_not_null',
    'contain',
    'not_contain',
    'start_with',
    'end_with'
].map(operator => ({ name: operator, label: i18n.t(`${i18nPrefix}.${operator}`) }));

const RuleOperatorDropdown: FunctionComponent = () => {
    const { Dropdown } = Stage.Basic;
    const operatorsOptions = operators.map(
        (operator): DropdownItemProps => ({ text: operator.label, value: operator.name })
    );

    return <Dropdown search selection name="ruleOperator" options={operatorsOptions} />;
};
export default RuleOperatorDropdown;
