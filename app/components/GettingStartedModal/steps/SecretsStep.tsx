import React, { memo, useEffect, useMemo } from 'react';

import { Form } from '../../basic';
import { useInputs, useResettableState } from '../../../utils/hooks';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';

const validateEmail = (email: string) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

type Props = {
    selectedEnvironment: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange: (typedSecrets: GettingStartedSecretsData) => void;
};

const SecretsStep = ({ selectedEnvironment, typedSecrets, onChange }: Props) => {
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

    let defaultErrors = { ...secretInputs };
    Object.keys(defaultErrors).forEach(v => (defaultErrors[v] = false));

    const [errors, setErrors, clearErrors] = useResettableState(defaultErrors);

    useEffect(() => resetSecretInputs(), [typedSecrets]);
    useEffect(() => {
        if (!typedSecrets) onChange(defaultSecretInputs);
    }, []);

    return (
        <Form>
            {selectedEnvironment.secrets.map(({ name, label, type }) => {
                const handleBlur = () => {
                    onChange(secretInputs);
                    clearErrors();
                    if (
                        secretInputs.hasOwnProperty('gcp_client_email') &&
                        secretInputs.gcp_client_email &&
                        !validateEmail(secretInputs.gcp_client_email)
                    ) {
                        setErrors({
                            ...errors,
                            gcp_client_email: {
                                content: 'Please enter a valid email address'
                            }
                        });
                    }
                };
                return (
                    <Form.Field key={name}>
                        <Form.Input
                            type={type}
                            name={name}
                            error={errors[name]}
                            label={label}
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
