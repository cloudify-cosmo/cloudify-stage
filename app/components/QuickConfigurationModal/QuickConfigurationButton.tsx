import { Form, HeaderBar } from 'cloudify-ui-components';
import React, { ChangeEvent, CSSProperties, memo, useEffect, useRef, useState } from 'react';
import { JSONSchemaItem } from './model';

type Props = {
    name: string;
    logo: string;
    value?: boolean;
};

const style: CSSProperties = {
    border: '1px solid silver',
    borderRadius: '5px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const QuickConfigurationButton = memo(({ name, logo, value }: Props) => {
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => setLocalValue(value), [value]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.checked);
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
                style={{ display: 'none' }}
                onChange={handleChange}
            />
            <img src={logo} alt={name} />
        </Form.Field>
    );
});

export default QuickConfigurationButton;
