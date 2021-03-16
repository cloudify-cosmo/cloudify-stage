import { Form } from 'cloudify-ui-components';
import React, { FC, forwardRef, memo, Ref } from 'react';

import UncontrolledForm from '../common/UncontrolledForm';
import type { GettingStartedData, GettingStartedSchemaItem } from '../model';

type Props = {
    selectedPlugin: GettingStartedSchemaItem;
    typedSecrets: GettingStartedData;
};

const SecretsStep = ({ selectedPlugin, typedSecrets }: Props, ref: Ref<HTMLFormElement>) => {
    return (
        <UncontrolledForm ref={ref} data={typedSecrets}>
            {selectedPlugin.secrets.map(itemSecret => (
                <div key={itemSecret.name}>
                    <Form.Field>
                        <Form.Input
                            name={`${selectedPlugin.name}.${itemSecret.name}`}
                            type={itemSecret.type}
                            label={itemSecret.label}
                        />
                    </Form.Field>
                </div>
            ))}
        </UncontrolledForm>
    );
};

type SecretsStep = FC<Props | { ref: Ref<HTMLFormElement> }>;

export default memo(forwardRef(SecretsStep)) as SecretsStep;
