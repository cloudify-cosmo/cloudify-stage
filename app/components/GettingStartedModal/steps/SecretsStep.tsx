import React, { memo, useEffect, useMemo } from 'react';

import { Form } from '../../basic';
import { useInputs } from '../../../utils/hooks';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';
import type { Errors } from '../GettingStartedModal';

type Props = {
    selectedEnvironment: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange: (typedSecrets: GettingStartedSecretsData) => void;
    errors: Errors;
};

const SecretsStep = ({ selectedEnvironment, typedSecrets, onChange, errors }: Props) => {
    const defaultSecretInputs: Record<string, any> = useMemo(
        () =>
            selectedEnvironment.secrets.reduce(
                (finalObject, secret) => ({
                    ...finalObject,
                    [secret.name]: ''
                }),
                {}
            ),
        [selectedEnvironment]
    );

    const [secretInputs, setSecretInputs, resetSecretInputs] = useInputs(typedSecrets || defaultSecretInputs);

    useEffect(() => resetSecretInputs(), [typedSecrets]);
    useEffect(() => {
        if (!typedSecrets) onChange(defaultSecretInputs);
    }, []);

    return (
        <Form>
            {selectedEnvironment.secrets.map(({ name, label, type, description }) => {
                const handleBlur = () => {
                    onChange(secretInputs);
                };
                if (type === 'boolean') {
                    return (
                        <Form.Checkbox
                            toggle
                            label=""
                            name={name}
                            value={secretInputs[name]}
                            onChange={setSecretInputs}
                        />
                    );
                }
                return (
                    <Form.Field key={name} label={label} help={description}>
                        <Form.Input
                            type={type}
                            name={name}
                            error={errors[name]}
                            value={secretInputs[name]}
                            onChange={setSecretInputs}
                            onBlur={handleBlur}
                        />
                    </Form.Field>
                );
            })}
        </Form>
    );
};

export default memo(SecretsStep);
