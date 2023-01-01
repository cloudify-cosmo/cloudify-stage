import React from 'react';
import RevertToDefaultIcon, { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

export default function StringInputField(props: ErrorAwareInputFieldProps & RevertableInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error } = props;

    return _.includes(value, '\n') ? (
        <>
            <Form.TextArea name={name} value={value} onChange={onChange} />
            <PositionedRevertToDefaultIcon {...props} />
        </>
    ) : (
        <Form.Input
            name={name}
            value={value}
            fluid
            error={error}
            icon={<RevertToDefaultIcon {...props} />}
            onChange={onChange}
        />
    );
}
