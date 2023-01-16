import React, { memo } from 'react';

import { Form, Button, Image } from '../../../../../basic';

type Props = {
    logo: string;
    label: string;
    onClick?: () => void;
};

const EnvironmentButton = memo(({ logo, label, onClick }: Props) => {
    return (
        <Form.Field>
            <Button fluid basic size="huge" style={{ height: 70 }} onClick={onClick}>
                <Image src={logo} inline style={{ maxHeight: '100%', cursor: 'pointer' }} />
                <span style={{ marginLeft: 10 }}>{label}</span>
            </Button>
        </Form.Field>
    );
});

export default EnvironmentButton;
