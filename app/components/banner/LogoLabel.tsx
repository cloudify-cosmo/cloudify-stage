import React, { FunctionComponent } from 'react';

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
                fontFamily: 'JosefinSans-Bold, sans-serif'
            }}
        >
            {content}
        </h2>
    );
};

export default LogoLabel;
