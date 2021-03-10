import { Form } from 'cloudify-ui-components';
import React, { ChangeEvent, CSSProperties, memo, useEffect, useRef, useState } from 'react';
import { Ref as SemanticRef } from 'semantic-ui-react';
import createCheckboxRefExtractor from '../../common/createCheckboxRefExtractor';

const style: CSSProperties = {
    border: '1px solid silver',
    borderRadius: '5px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

const defaultStyle: CSSProperties = {
    ...style,
    background: 'white'
};

const selectedStyle: CSSProperties = {
    ...style,
    background: '#e6e6e6'
};

type Props = {
    name: string;
    logo: string;
    label: string;
    value?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const TechnologyButton = memo(({ name, logo, label, value, ...other }: Props) => {
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
            return () => {
                clearTimeout(handle);
            };
        }
        return undefined;
    }, [inputRef.current]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget.firstChild as HTMLInputElement;
        setLocalValue(target.checked);
        if (other.onChange) {
            other.onChange(e);
        }
    };
    const handleClick = () => {
        setLocalValue(!localValue);
    };
    return (
        <Form.Field
            className={localValue ? 'checked' : ''}
            style={localValue ? selectedStyle : defaultStyle}
            onClick={handleClick}
        >
            <SemanticRef innerRef={createCheckboxRefExtractor(inputRef)}>
                <Form.Checkbox
                    name={name}
                    label=" "
                    checked={localValue}
                    style={{ display: 'none' }}
                    {...other}
                    onChange={handleChange}
                />
            </SemanticRef>
            <img style={{ maxHeight: '80%' }} src={logo} alt={label} />
            <span>{label}</span>
        </Form.Field>
    );
});

export default TechnologyButton;
