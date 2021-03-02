import { Form, HeaderBar } from 'cloudify-ui-components';
import React, { ChangeEvent, CSSProperties, memo, useEffect, useRef, useState } from 'react';
// import { JSONSchemaItem } from './model';

type Props = {
    name: string;
    logo: string;
    label: string;
    value?: boolean;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const style: CSSProperties = {
    border: '1px solid silver',
    borderRadius: '5px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const TechnologyButton = memo(({ name, logo, label, value, onBlur }: Props) => {
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => setLocalValue(value), [value]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.checked);
    };
    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        if (onBlur) {
            onBlur(e);
        }
    };
    const handleClick = () => {
        setLocalValue(!localValue);
    };
    return (
        <Form.Field className={localValue ? 'checked' : ''} style={style} onClick={handleClick}>
            <Form.Checkbox
                name={name}
                label=" "
                checked={localValue}
                // style={{ display: 'none' }}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <img src={logo} alt={label} />
        </Form.Field>
    );
});

export default TechnologyButton;
