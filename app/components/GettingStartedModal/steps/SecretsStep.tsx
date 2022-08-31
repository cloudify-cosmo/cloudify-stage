import React, { memo, useEffect, useMemo } from 'react';

import { Form } from '../../basic';
import { useInputs, useResettableState } from '../../../utils/hooks';
import StageUtils from '../../../utils/stageUtils';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';

const t = StageUtils.getT('gettingStartedModal.secrets');

const isEmailValid = (email: string) => {
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

    const defaultErrors = { ...secretInputs };
    Object.keys(defaultErrors).forEach(v => {
        defaultErrors[v] = false;
    });

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
                    if (type === 'email' && !isEmailValid(secretInputs[name])) {
                        setErrors({
                            ...errors,
                            [name]: {
                                content: t('invalidEmail')
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
