import type { FunctionComponent } from 'react';
import React from 'react';
import { Logo } from '../../../basic';

const LargeLogo: FunctionComponent = () => {
    return (
        <Logo
            style={{
                textAlign: 'center',
                margin: '0 auto',
                display: 'block',
                width: 100,
                height: 100
            }}
        />
    );
};

export default LargeLogo;
