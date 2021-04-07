import { camelCase } from 'lodash';
import type { FunctionComponent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { i18nPrefix } from './consts';

const { i18n } = Stage;
const operatorsOptions = [
    'any_of',
    'not_any_of',
    'is_null',
    'is_not_null',
    'contain',
    'not_contain',
    'start_with',
    'end_with'
].map(
    (operator): DropdownItemProps => ({
        text: i18n.t(`${i18nPrefix}.operatorsLabels.${camelCase(operator)}`),
        value: operator
    })
);

const RuleOperatorDropdown: FunctionComponent = () => {
    const { Dropdown } = Stage.Basic;

    return <Dropdown search selection name="ruleOperator" options={operatorsOptions} />;
};
export default RuleOperatorDropdown;
