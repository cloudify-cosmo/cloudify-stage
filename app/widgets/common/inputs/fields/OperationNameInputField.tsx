import React from 'react';
import { flatten } from 'lodash';
import i18n from 'i18next';
import type { DynamicDropdownInputFieldProps } from './types';
import useFetchUrlWithDeploymentId from './useFetchUrlWithDeploymentId';
import DynamicDropdown from '../../components/DynamicDropdown';

export default function OperationNameInputField({
    name,
    onChange,
    toolbox,
    constraints,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = useFetchUrlWithDeploymentId('/nodes?_include=operations', constraints);

    return (
        <DynamicDropdown
            placeholder={i18n.t('input.operation.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            itemsFormatter={items => flatten(items.map(item => Object.keys(item.operations))).map(id => ({ id }))}
            searchParams={[]}
            {...restProps}
        />
    );
}
