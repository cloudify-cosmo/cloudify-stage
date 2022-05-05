import type { FunctionComponent } from 'react';
import React from 'react';
import { productFont } from '../fonts';

interface LogoLabelProps {
    color: string;
    content: string;
}

const LogoLabel: FunctionComponent<LogoLabelProps> = ({ color, content }) => {
    return (
        <h2
            style={{
                color,
                fontSize: '2em',
                fontFamily: `${productFont}, sans-serif`
            }}
        >
            {content}
        </h2>
    );
};

export default LogoLabel;
