import { camelCase } from 'lodash';
import type { FunctionComponent } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

import { getTranslation } from './common';
import { FilterRuleRowType } from './types';

interface RuleRowTypeDropdownProps {
    onChange: (value: FilterRuleRowType) => void;
    value: FilterRuleRowType;
}

const ruleRowTypeOptions = (() => {
    return Object.values(FilterRuleRowType).map(
        (ruleType): DropdownItemProps => ({
            text: getTranslation(`ruleTypesLabels.${camelCase(ruleType)}`),
            value: ruleType
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
