import React, { memo } from 'react';

import { Form } from '../../../../../basic';
import EnvironmentButton from './EnvironmentButton';

import type { GettingStartedSchema, GettingStartedEnvironmentsData } from '../../model';

type Props = {
    schema: GettingStartedSchema;
    onChange?: (environment: GettingStartedEnvironmentsData) => void;
};

const EnvironmentsStep = ({ schema, onChange }: Props) => {
    return (
        <Form>
            {schema.content.map(({ name, logo, label }) => {
                const handleClick = () => {
                    const newLocalSelectedEnvironment = { [name]: true };
                    onChange?.(newLocalSelectedEnvironment);
                };

                return <EnvironmentButton key={name} logo={logo} label={label} onClick={handleClick} />;
            })}
        </Form>
    );
};

export default memo(EnvironmentsStep);
