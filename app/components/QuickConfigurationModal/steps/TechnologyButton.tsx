import { Form, HeaderBar } from 'cloudify-ui-components';
import React, { ChangeEvent, CSSProperties, memo, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Ref as SemanticRef } from 'semantic-ui-react';
import createCheckboxRefExtractor from '../common/createCheckboxRefExtractor';
// import { JSONSchemaItem } from './model';

type Props = {
    name: string;
    logo: string;
    label: string;
    value?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const style: CSSProperties = {
    border: '1px solid silver',
    borderRadius: '5px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const TechnologyButton = memo(({ name, logo, label, value, ...other }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => setLocalValue(value), [value]);
    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            const handle = setTimeout(() => {
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
        <Form.Field className={localValue ? 'checked' : ''} style={style} onClick={handleClick}>
            <SemanticRef innerRef={createCheckboxRefExtractor(inputRef)}>
                <Form.Checkbox name={name} label=" " checked={localValue} {...other} onChange={handleChange} />
            </SemanticRef>
            <img style={{ maxHeight: '80%' }} src={logo} alt={label} />
            <span>{label}</span>
        </Form.Field>
    );
});

export default TechnologyButton;
