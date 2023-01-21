import React from 'react';
import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';
import { Form } from '../../../../components/basic';

export default function GenericInputField(props: ErrorAwareInputFieldProps & RevertableInputFieldProps) {
    const { name, value, onChange, error } = props;

    return (
        <>
            <Form.Json name={name} value={value} onChange={onChange} error={error} />
            <PositionedRevertToDefaultIcon {...props} />
        </>
    );
}
