import React, { FC, forwardRef, memo, Ref } from 'react';
import UncontrolledForm from '../../common/UncontrolledForm';
import { JSONSchema, TechnologiesData } from '../../model';
import TechnologyButton from './TechnologyButton';

type Props = {
    schema: JSONSchema;
    technologies: TechnologiesData;
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
