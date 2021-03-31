import React, { memo, useEffect } from 'react';

import useResettableState from '../../../../utils/hooks/useResettableState';
import { Form, Button, Image } from '../../../basic';

type Props = {
    logo: string;
    label: string;
    value?: boolean;
    onChange?: (value: boolean) => void;
};

const TechnologyButton = memo(({ logo, label, value, onChange }: Props) => {
    const [localValue, setLocalValue, resetLocalValue] = useResettableState(value);
    useEffect(() => resetLocalValue(), [value]);

    const handleClick = () => {
        const newLocalValue = !localValue;
        setLocalValue(newLocalValue);
        onChange?.(newLocalValue);
    };

    return (
        <Form.Field>
            <Button fluid basic size="huge" active={localValue} style={{ height: 70 }} onClick={handleClick}>
                <Image src={logo} inline style={{ maxHeight: '100%', cursor: 'pointer' }} />
                <span style={{ marginLeft: 10 }}>{label}</span>
            </Button>
        </Form.Field>
    );
});

export default TechnologyButton;
