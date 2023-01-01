import React from 'react';
import RevertToDefaultIcon from './RevertToDefaultIcon';
import type { RevertableInputFieldProps } from './types';
import { Form } from '../../../../components/basic';

export default function BooleanInputField(props: RevertableInputFieldProps) {
    const { name, value, onChange } = props;
    const isBooleanValue = value === false || value === true;
    const checked = isBooleanValue ? value : undefined;

    return (
        <>
            <Form.Checkbox
                name={name}
                toggle
                label={name}
                checked={checked}
                indeterminate={!isBooleanValue}
                onChange={onChange}
                help={undefined}
            />
            &nbsp;&nbsp;&nbsp;
            <RevertToDefaultIcon {...props} />
        </>
    );
}
