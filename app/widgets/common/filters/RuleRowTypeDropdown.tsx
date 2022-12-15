import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { camelCase } from 'lodash';
import type { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { Dropdown } from '../../../components/basic';

import { getTranslation } from './common';
import { FilterRuleRowType } from './types';

interface RuleRowTypeDropdownProps {
    onChange: (value: FilterRuleRowType) => void;
    value: FilterRuleRowType;
}

const RuleRowTypeDropdown: FunctionComponent<RuleRowTypeDropdownProps> = ({ onChange, value }) => {
    const ruleRowTypeOptions = useMemo(() => {
        return Object.values(FilterRuleRowType).map(
            (ruleType): DropdownItemProps => ({
                text: getTranslation(`ruleTypesLabels.${camelCase(ruleType)}`),
                value: ruleType
            })
        );
    }, undefined);
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
