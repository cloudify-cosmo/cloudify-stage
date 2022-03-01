import React, { FunctionComponent, memo } from 'react';

interface CheckboxLabelProps {
    label: string;
}

const CheckboxLabel: FunctionComponent<CheckboxLabelProps> = ({ label }) => {
    return (
        <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: label
            }}
        />
    );
};

export default memo(CheckboxLabel);
