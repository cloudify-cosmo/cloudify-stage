import React, { memo, useEffect, useState } from 'react';

import { Form } from 'semantic-ui-react';
import TechnologyButton from './TechnologyButton';

import type { GettingStartedSchema, GettingStartedTechnologiesData } from '../../model';

type Props = {
    schema: GettingStartedSchema;
    selectedTechnologies?: GettingStartedTechnologiesData;
    onChange?: (technologies: GettingStartedTechnologiesData) => void;
};

const TechnologiesStep = ({ schema, selectedTechnologies, onChange }: Props) => {
    const [localSelectedTechnologies, setLocalSelectedTechnologies] = useState(() => selectedTechnologies ?? {});
    useEffect(() => setLocalSelectedTechnologies(selectedTechnologies ?? {}), [selectedTechnologies]);
    return (
        <Form>
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
        </Form>
    );
};

export default memo(TechnologiesStep);
