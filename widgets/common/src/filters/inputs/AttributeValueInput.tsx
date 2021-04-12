import type { FunctionComponent } from 'react';
import { FilterRuleOperator, LabelsFilterRuleOperators } from '../types';
import DynamicDropdown from '../../DynamicDropdown';

interface AttributeValueInputProps {
    onChange: (value: string[]) => void;
    fetchUrl: string;
    placeholder: string;
    valueProp: string;
    operator: FilterRuleOperator;
    toolbox: Stage.Types.Toolbox;
    value: string[];
}

const AttributeValueInput: FunctionComponent<AttributeValueInputProps> = ({
    onChange,
    fetchUrl,
    placeholder,
    valueProp,
    operator,
    toolbox,
    value
}) => {
    const { Input } = Stage.Basic;

    if (operator === LabelsFilterRuleOperators.AnyOf || operator === LabelsFilterRuleOperators.NotAnyOf) {
        return (
            <DynamicDropdown
                fetchUrl={fetchUrl}
                onChange={onChange}
                toolbox={toolbox}
                clearable={false}
                multiple
                placeholder={placeholder}
                value={value}
                valueProp={valueProp}
            />
        );
    }

    // TODO(RD-1762): Add support for type 'attribute' and operators different from 'any_of' and 'not_any_of'
    const textValue = _.castArray(value)[0] || '';
    return <Input type="text" onChange={(_event, { value: newValue }) => onChange([newValue])} value={textValue} />;
};

export default AttributeValueInput;
