import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function SecretKeyInputField({
    name,
    value,
    onChange,
    toolbox,
    error,
    constraints
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/searches/secrets?_include=key';

    return (
        <DynamicDropdown
            name={name}
            error={error}
            placeholder={Stage.i18n.t('input.secret_key.placeholder')}
            value={value}
            valueProp="key"
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            constraints={constraints}
        />
    );
}
