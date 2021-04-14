import type { FunctionComponent } from 'react';

import DynamicDropdown from '../../DynamicDropdown';
import type { CommonAttributeValueInputProps } from './types';
import { isAnyOperator } from './common';
import { i18n, i18nPlaceholdersPrefix } from '../consts';
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
    if (isAnyOperator(operator)) {
        return (
            <DynamicDropdown
                name="ruleValue"
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

    return (
        <MultipleStringValuesInput
            name="ruleValue"
            value={value}
            onChange={onChange}
            placeholder={i18n.t(`${i18nPlaceholdersPrefix}.multipleStrings`)}
        />
    );
};

export default AttributeValueInput;
