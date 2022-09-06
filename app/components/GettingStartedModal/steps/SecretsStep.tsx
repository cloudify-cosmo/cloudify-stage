import React, { memo, useEffect, useMemo } from 'react';

import { Form } from '../../basic';
import { useInputs, useResettableState } from '../../../utils/hooks';
import StageUtils from '../../../utils/stageUtils';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';

const t = StageUtils.getT('gettingStartedModal.secrets');

const emailRegex = /\S+@\S+\.\S+/;
const isEmailValid = (email: string) => emailRegex.test(email);

type Props = {
    selectedEnvironment: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange: (typedSecrets: GettingStartedSecretsData, validationErrors: boolean) => void;
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
    const defaultErrors = _.mapValues(secretInputs, () => false);
    const [errors, setErrors, clearErrors] = useResettableState(defaultErrors);

    useEffect(() => resetSecretInputs(), [typedSecrets]);
    useEffect(() => {
        if (!typedSecrets) onChange(defaultSecretInputs, false);
    }, []);

    return (
        <Form>
            {selectedEnvironment.secrets.map(({ name, label, type, description }) => {
                const handleBlur = () => {
                    clearErrors();
                    if (type === 'email' && !isEmailValid(secretInputs[name])) {
                        onChange(secretInputs, true);
                        setErrors({
                            ...errors,
                            [name]: {
                                content: t('invalidEmail')
                            }
                        });
                    }
                    onChange(secretInputs, false);
                };
                return (
                    <Form.Field key={name} label={label} help={description}>
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
