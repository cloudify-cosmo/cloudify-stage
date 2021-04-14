import { castArray } from 'lodash';
import type { FunctionComponent } from 'react';

import DynamicDropdown from '../../DynamicDropdown';
import type { CommonAttributeValueInputProps } from './types';
import { isAnyOfOrNotAnyOfOperator } from './common';

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

    // TODO(RD-1762): Add support for type 'attribute' and operators different from 'any_of' and 'not_any_of'
    const textValue = castArray(value)[0] || '';
    return <Input type="text" onChange={(_event, { value: newValue }) => onChange([newValue])} value={textValue} />;
};

export default AttributeValueInput;
