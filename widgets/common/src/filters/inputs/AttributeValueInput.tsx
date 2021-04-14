import type { FunctionComponent } from 'react';

import DynamicDropdown from '../../DynamicDropdown';
import type { CommonAttributeValueInputProps } from './types';
import { isAnyOfOrNotAnyOfOperator } from './common';
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
    if (isAnyOfOrNotAnyOfOperator(operator)) {
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

    return <MultipleStringValuesInput value={value} onChange={onChange} />;
};

export default AttributeValueInput;
