import type { FunctionComponent } from 'react';

import DynamicDropdown from '../../DynamicDropdown';
import type { CommonAttributeValueInputProps } from './types';
import { getPlaceholderTranslation, isMultipleValuesOperator } from '../common';
import MultipleStringValuesInput from './MultipleStringValuesInput';

interface AttributeValueInputProps extends CommonAttributeValueInputProps {
    fetchUrl: string;
    placeholder: string;
    valueProp: string;
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
    if (isMultipleValuesOperator(operator)) {
        return (
            <DynamicDropdown
                name="ruleValue"
                fetchUrl={fetchUrl}
                onChange={onChange}
                toolbox={toolbox}
                allowAdditions
                clearable={false}
                multiple
                placeholder={placeholder}
                value={value}
                valueProp={valueProp}
            />
        );
    }

    return (
        <MultipleStringValuesInput
            name="ruleValue"
            value={value}
            onChange={onChange}
            placeholder={getPlaceholderTranslation('multipleStrings')}
        />
    );
};

export default AttributeValueInput;
