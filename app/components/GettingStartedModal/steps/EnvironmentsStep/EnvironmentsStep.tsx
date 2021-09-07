import React, { memo, useEffect } from 'react';

import { useResettableState } from '../../../../utils/hooks';
import { Form } from '../../../basic';
import EnvironmentButton from './EnvironmentButton';

import type { GettingStartedSchema, GettingStartedEnvironmentsData } from '../../model';

type Props = {
    schema: GettingStartedSchema;
    selectedEnvironments?: GettingStartedEnvironmentsData;
    onChange?: (environments: GettingStartedEnvironmentsData) => void;
};

const EnvironmentsStep = ({ schema, selectedEnvironments, onChange }: Props) => {
    const [
        localSelectedEnvironments,
        setLocalSelectedEnvironments,
        resetLocalSelectedEnvironments
    ] = useResettableState(selectedEnvironments ?? {});
    useEffect(() => resetLocalSelectedEnvironments(), [selectedEnvironments]);

    return (
        <Form>
            {schema.map(({ name, logo, label }) => {
                const handleChange = (value: boolean) => {
                    const newLocalSelectedEnvironments = { ...localSelectedEnvironments, [name]: value };
                    setLocalSelectedEnvironments(newLocalSelectedEnvironments);
                    onChange?.(newLocalSelectedEnvironments);
                };
                return (
                    <EnvironmentButton
                        key={name}
                        logo={logo}
                        label={label}
                        value={localSelectedEnvironments[name]}
                        onChange={handleChange}
                    />
                );
            })}
        </Form>
    );
};

export default memo(EnvironmentsStep);
