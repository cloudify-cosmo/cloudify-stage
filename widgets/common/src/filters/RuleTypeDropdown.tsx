import { camelCase } from 'lodash';
import type { FunctionComponent, SyntheticEvent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import type { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

import { i18nPrefix } from './consts';
import { FilterRuleRowType } from './types';

interface RuleTypeDropdownProps {
    onChange: (value: FilterRuleRowType) => void;
    ruleType: FilterRuleRowType;
}

const ruleTypeOptions = (() => {
    const { i18n } = Stage;
    return Object.values(FilterRuleRowType).map(
        (ruleType): DropdownItemProps => ({
            text: i18n.t(`${i18nPrefix}.ruleTypesLabels.${camelCase(ruleType)}`),
            value: ruleType as FilterRuleRowType
        })
    );
})();

const RuleTypeDropdown: FunctionComponent<RuleTypeDropdownProps> = ({ onChange, ruleType }) => {
    const { Dropdown } = Stage.Basic;

    return (
        <Dropdown
            clearable={false}
            search
            selection
            selectOnNavigation
            name="ruleType"
            options={ruleTypeOptions}
            value={ruleType}
            onChange={(_event: SyntheticEvent, data: DropdownProps) => onChange(data.value as FilterRuleRowType)}
        />
    );
};
export default RuleTypeDropdown;
