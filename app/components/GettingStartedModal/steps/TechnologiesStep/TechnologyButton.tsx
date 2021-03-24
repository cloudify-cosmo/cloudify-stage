import React, { memo, useEffect, useState } from 'react';

import { Form } from '../../../basic';

type Props = {
    logo: string;
    label: string;
    value?: boolean;
    onChange?: (value: boolean) => void;
};

const TechnologyButton = memo(({ logo, label, value, onChange }: Props) => {
    const { Button, Image } = Stage.Basic;

    const [localValue, setLocalValue] = useState(value);
    useEffect(() => setLocalValue(value), [value]);

    const handleClick = () => {
        const newLocalValue = !localValue;
        setLocalValue(newLocalValue);
        onChange?.(newLocalValue);
    };

    return (
        <Form.Field>
            <Button fluid basic size="huge" active={localValue} style={{ height: '70px' }} onClick={handleClick}>
                <Image src={logo} inline style={{ maxHeight: '100%', cursor: 'pointer' }} />
                <span style={{ marginLeft: '10px' }}>{label}</span>
            </Button>
        </Form.Field>
    );
});

export default TechnologyButton;
