import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';
import { FilterRuleType } from '../filters/types';
import RulesForm from '../filters/RulesForm';

type LabelFilterProps = Pick<
    Stage.Types.CustomConfigurationComponentProps<any[]>,
    'name' | 'onChange' | 'value' | 'widgetlessToolbox'
>;

const LabelFilter: FunctionComponent<LabelFilterProps> = ({ widgetlessToolbox, name, value, onChange }) => {
    const handleChange: ComponentProps<typeof RulesForm>['onChange'] = newValue => {
        onChange(undefined, { name, value: newValue });
    };

    return (
        <RulesForm
            initialFilters={value}
            hideType
            onChange={handleChange}
            markErrors={false}
            toolbox={widgetlessToolbox}
            resourceType="blueprints"
            defaultType={FilterRuleType.Label}
        />
    );
};

export default LabelFilter;
