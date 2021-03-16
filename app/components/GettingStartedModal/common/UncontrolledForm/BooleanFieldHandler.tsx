import { Form } from 'cloudify-ui-components';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Ref as SemanticRef } from 'semantic-ui-react';

import type { ChangeEvent } from 'react';

import createCheckboxRefExtractor from './createCheckboxRefExtractor';

type Props = {
    name: string;
    value?: boolean;
    // eslint-disable-next-line no-shadow
    children: (checked: boolean | undefined, handleChange: (checked: boolean) => void) => JSX.Element;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const BooleanFieldHandler = ({ name, value, children, onChange }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => setLocalValue(value), [value]);
    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            const handle = setTimeout(() => {
                // extracting current input checked property value to set TechnologyButton internal state
                // it is necessary to do it after component is rendered - setTimeout was used to do it
                setLocalValue(input.checked);
            });
            return () => clearTimeout(handle);
        }
        return undefined;
    }, [inputRef.current]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget.firstChild as HTMLInputElement;
        setLocalValue(target.checked);
        if (onChange) {
            onChange(e);
        }
    };
    return (
        <Form.Field>
            <SemanticRef innerRef={createCheckboxRefExtractor(inputRef)}>
                <Form.Checkbox
                    style={{ display: 'none' }}
                    name={name}
                    label=" "
                    help=" "
                    checked={localValue}
                    onChange={handleChange}
                />
            </SemanticRef>
            {children(localValue, setLocalValue)}
        </Form.Field>
    );
};

export default memo(BooleanFieldHandler);
