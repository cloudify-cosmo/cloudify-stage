import React from 'react';
import i18n from 'i18next';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function BlueprintIdInputField({ name, value, onChange, ...restProps }: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/searches/blueprints?_include=id&state=uploaded';

    return (
        <DynamicDropdown
            name={name}
            placeholder={i18n.t('input.blueprint_id.placeholder')}
            value={value}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            {...restProps}
        />
    );
}
