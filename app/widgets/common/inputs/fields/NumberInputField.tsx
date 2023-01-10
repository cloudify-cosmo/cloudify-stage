import React from 'react';
import RevertToDefaultIcon from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

type NumberInputField = ErrorAwareInputFieldProps &
    RevertableInputFieldProps & {
        type: 'integer' | 'float';
        constraints: {
            inRange: [number, number];
            greaterThan: number;
            greaterOrEqual: number;
            lessThan: number;
            lessOrEqual: number;
        };
    };

export default function NumberInputField(props: NumberInputField) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, type, error, constraints } = props;
    const { inRange, greaterThan, greaterOrEqual, lessThan, lessOrEqual } = constraints;

    // Limit numerical values if at least one of range limitation constraints is set
    const min = _.max([inRange ? inRange[0] : null, greaterThan, greaterOrEqual]);
    const max = _.min([inRange ? inRange[1] : null, lessThan, lessOrEqual]);

    return (
        <Form.Input
            name={name}
            value={value}
            fluid
            error={error}
            type="number"
            step={type === 'integer' ? 1 : 'any'}
            min={min}
            max={max}
            icon={<RevertToDefaultIcon {...props} />}
            onChange={onChange}
        />
    );
}
