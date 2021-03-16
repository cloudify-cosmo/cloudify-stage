import React, { forwardRef, memo } from 'react';

import type { Ref } from 'react';

import UncontrolledForm from '../../common/UncontrolledForm';
import TechnologyButton from './TechnologyButton';

import type { GettingStartedSchema, GettingStartedTechnologiesData } from '../../model';

type Props = {
    schema: GettingStartedSchema;
    technologies: GettingStartedTechnologiesData;
};

const TechnologiesStep = ({ schema, technologies }: Props, ref: Ref<HTMLFormElement>) => {
    return (
        <UncontrolledForm ref={ref} data={technologies}>
            {schema.map(itemSchema => (
                <TechnologyButton
                    key={itemSchema.name}
                    name={itemSchema.name}
                    logo={itemSchema.logo}
                    label={itemSchema.label}
                />
            ))}
        </UncontrolledForm>
    );
};

export default memo(forwardRef(TechnologiesStep));
