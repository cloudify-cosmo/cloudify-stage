import { camelCase } from 'lodash';
import type { FunctionComponent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

import { i18nPrefix } from './consts';
import { FilterRuleRowType } from './types';

interface RuleRowTypeDropdownProps {
    onChange: (value: FilterRuleRowType) => void;
    value: FilterRuleRowType;
}

const ruleRowTypeOptions = (() => {
    const { i18n } = Stage;
    return Object.values(FilterRuleRowType).map(
        (ruleType): DropdownItemProps => ({
            text: i18n.t(`${i18nPrefix}.ruleTypesLabels.${camelCase(ruleType)}`),
            value: ruleType as FilterRuleRowType
        })
    );
})();

const RuleRowTypeDropdown: FunctionComponent<RuleRowTypeDropdownProps> = ({ onChange, value }) => {
    const { Dropdown } = Stage.Basic;

    return (
        <Dropdown
            clearable={false}
            search
            selection
            selectOnNavigation
            name="ruleRowType"
            options={ruleRowTypeOptions}
            onChange={(_event, data) => onChange(data.value as FilterRuleRowType)}
            value={value}
        />
    );
};
export default RuleRowTypeDropdown;
