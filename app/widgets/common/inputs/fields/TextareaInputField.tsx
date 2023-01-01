import React from 'react';
import { DEFAULT_TEXTAREA_ROWS } from '../consts';
import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { RevertableInputFieldProps } from './types';

interface TextareaInputFieldProps extends RevertableInputFieldProps {
    rows: number;
}

export default function TextareaInputField(props: TextareaInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, rows } = props;

    return (
        <>
            <Form.TextArea name={name} value={value} onChange={onChange} rows={rows ?? DEFAULT_TEXTAREA_ROWS} />
            <PositionedRevertToDefaultIcon {...props} />
        </>
    );
}
