import React, { memo, useEffect, useMemo, useState } from 'react';

import { Form } from '../../../../../basic';
import { useInputs } from '../../../../../../utils/hooks';
import SecretsExistMessage from './SecretsExistMessage';
import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../../model';
import type { Errors } from '../../GettingStartedModal';
import useAllSecretsExist from './useAllSecretsExist';

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
    const [overrideSecrets, setOverrideSecrets] = useState(false);

    const allSecretsExist = useAllSecretsExist(Object.keys(defaultSecretInputs));

    useEffect(() => resetSecretInputs(), [typedSecrets]);
    useEffect(() => {
        if (!typedSecrets) onChange(defaultSecretInputs);
    }, []);

    return (
        <>
            {allSecretsExist && <SecretsExistMessage {...{ overrideSecrets, setOverrideSecrets }} />}
            <Form>
                {selectedEnvironment.secrets.map(({ name, label, type, description }) => {
                    const handleBlur = () => {
                        onChange(secretInputs);
                    };
                    return (
                        <Form.Field
                            key={name}
                            label={label}
                            help={description}
                            disabled={!overrideSecrets && allSecretsExist}
                        >
                            {type === 'boolean' ? (
                                <Form.Checkbox
                                    toggle
                                    label={label}
                                    name={name}
                                    checked={Boolean(secretInputs[name])}
                                    onChange={setSecretInputs}
                                    onBlur={handleBlur}
                                />
                            ) : (
                                <Form.Input
                                    type={type}
                                    name={name}
                                    error={errors[name]}
                                    value={secretInputs[name]}
                                    onChange={setSecretInputs}
                                    onBlur={handleBlur}
                                />
                            )}
                        </Form.Field>
                    );
                })}
            </Form>
        </>
    );
};

export default memo(SecretsStep);
