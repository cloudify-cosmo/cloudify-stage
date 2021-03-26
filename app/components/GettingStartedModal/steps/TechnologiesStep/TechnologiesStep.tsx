import React, { memo, useEffect } from 'react';

import { useResettableState } from '../../../../utils/hooks';
import { UnsafelyTypedForm } from '../../unsafelyTypedForm';
import TechnologyButton from './TechnologyButton';

import type { GettingStartedSchema, GettingStartedTechnologiesData } from '../../model';

type Props = {
    schema: GettingStartedSchema;
    selectedTechnologies?: GettingStartedTechnologiesData;
    onChange?: (technologies: GettingStartedTechnologiesData) => void;
};

const TechnologiesStep = ({ schema, selectedTechnologies, onChange }: Props) => {
    const [
        localSelectedTechnologies,
        setLocalSelectedTechnologies,
        resetLocalSelectedTechnologies
    ] = useResettableState(selectedTechnologies ?? {});
    useEffect(() => resetLocalSelectedTechnologies(), [selectedTechnologies]);
    return (
        // TODO(RD-1837): change to <Form ...> after forms will be changed to tsx version
        <UnsafelyTypedForm>
            {schema.map(({ name, logo, label }) => {
                const handleChange = (value: boolean) => {
                    const newLocalSelectedTechnologies = { ...localSelectedTechnologies, [name]: value };
                    setLocalSelectedTechnologies(newLocalSelectedTechnologies);
                    onChange?.(newLocalSelectedTechnologies);
                };
                return (
                    <TechnologyButton
                        key={name}
                        logo={logo}
                        label={label}
                        value={localSelectedTechnologies[name]}
                        onChange={handleChange}
                    />
                );
            })}
            {/* TODO(RD-1837): change to </Form> after forms will be changed to tsx version  */}
        </UnsafelyTypedForm>
    );
};

export default memo(TechnologiesStep);
