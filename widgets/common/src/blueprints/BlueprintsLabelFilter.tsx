import React, { FunctionComponent, ComponentProps } from 'react';
import { FilterRuleType } from '../filters/types';

type BlueprintsLabelFilterProps = Pick<
    Stage.Types.CustomConfigurationComponentProps<any[]>,
    'name' | 'onChange' | 'value' | 'widgetlessToolbox'
>;

const BlueprintsLabelFilter: FunctionComponent<BlueprintsLabelFilterProps> = ({
    widgetlessToolbox,
    name,
    value,
    onChange
}) => {
    const { RulesForm } = Stage.Common.Filters;

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

export default BlueprintsLabelFilter;
