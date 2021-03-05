import { Form } from 'cloudify-ui-components';
import React, { FC, forwardRef, memo, Ref } from 'react';

import UncontrolledForm from '../common/UncontrolledForm';
import type { JSONData, JSONSchemaItem } from '../model';

type Props = {
    schema: JSONSchemaItem;
    secrets: JSONData;
};

const SecretsStep = ({ schema, secrets }: Props, ref: Ref<HTMLFormElement>) => {
    return (
        <UncontrolledForm ref={ref} data={secrets}>
            {schema.secrets.map(itemSecret => (
                <Form.Field key={itemSecret.name}>
                    <Form.Input
                        name={`${schema.name}.${itemSecret.name}`}
                        type={itemSecret.type}
                        label={itemSecret.label}
                    />
                </Form.Field>
            ))}
        </UncontrolledForm>
    );
};

type SecretsStep = FC<Props | { ref: Ref<HTMLFormElement> }>;

export default memo(forwardRef(SecretsStep)) as SecretsStep;
