import React, { memo, useEffect } from 'react';

import { useResettableState } from '../../../../utils/hooks';
import { Form } from '../../../basic';
import EnvironmentButton from './EnvironmentButton';

import type { GettingStartedSchema, GettingStartedEnvironmentsData } from '../../model';

type Props = {
    schema: GettingStartedSchema;
    selectedEnvironment?: GettingStartedEnvironmentsData;
    onChange?: (environment: GettingStartedEnvironmentsData) => void;
};

const EnvironmentsStep = ({ schema, selectedEnvironment, onChange }: Props) => {
    const [localSelectedEnvironment, setLocalSelectedEnvironment, resetLocalSelectedEnvironment] = useResettableState(
        selectedEnvironment ?? {}
    );
    useEffect(() => resetLocalSelectedEnvironment(), [selectedEnvironment]);

    return (
        <Form>
            {schema.map(({ name, logo, label }) => {
                const handleChange = (value: boolean) => {
                    const newLocalSelectedEnvironment = { [name]: value };
                    setLocalSelectedEnvironment(newLocalSelectedEnvironment);
                    onChange?.(newLocalSelectedEnvironment);
                };

                return (
                    <EnvironmentButton
                        key={name}
                        logo={logo}
                        label={label}
                        value={localSelectedEnvironment[name]}
                        onChange={handleChange}
                    />
                );
            })}
        </Form>
    );
};

export default memo(EnvironmentsStep);
