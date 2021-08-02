import React, { memo, useEffect } from 'react';

import { Form } from '../../basic';
import { useInputs } from '../../../utils/hooks';
import { UnsafelyTypedFormField } from '../unsafelyTypedForm';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';

type Props = {
    selectedTechnology: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange?: (typedSecrets: GettingStartedSecretsData) => void;
};

const SecretsStep = ({ selectedTechnology, typedSecrets, onChange }: Props) => {
    const [secretInputs, setSecretInputs, resetSecretInputs] = useInputs(typedSecrets ?? {});
    useEffect(() => resetSecretInputs(), [typedSecrets]);

    return (
        <Form>
            {selectedTechnology.secrets.map(({ name, label, type }) => {
                const handleBlur = () => {
                    onChange?.(secretInputs);
                };
                return (
                    <UnsafelyTypedFormField key={name}>
                        <Form.Input
                            type={type}
                            name={name}
                            label={label}
                            value={secretInputs[name] ?? ''}
                            onChange={setSecretInputs}
                            onBlur={handleBlur}
                        />
                    </UnsafelyTypedFormField>
                );
            })}
        </Form>
    );
};

export default memo(SecretsStep);
