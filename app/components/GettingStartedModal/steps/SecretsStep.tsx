import React, { memo, useEffect, useMemo, useState } from 'react';

import { Checkbox, Form, Message } from '../../basic';
import { useInputs } from '../../../utils/hooks';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';
import type { Errors } from '../GettingStartedModal';
import useFetchSecrets from '../secrets/useFetchSecrets';

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

    const allExistingSecrets = useFetchSecrets();
    const allExistingSecretsKeys = allExistingSecrets.response?.map((secret: { key: string }) => secret.key);
    const defaultSecretInputsKeys = Object.keys(defaultSecretInputs);
    const isSecretsExist = allExistingSecretsKeys?.some(secret => defaultSecretInputsKeys.includes(secret));

    useEffect(() => resetSecretInputs(), [typedSecrets]);
    useEffect(() => {
        if (!typedSecrets) onChange(defaultSecretInputs);
    }, []);

    return (
        <>
            {isSecretsExist && (
                <Message warning>
                    <Message.Content>
                        <Message.Header>Secrets already exists</Message.Header>
                        <Checkbox
                            label="Override secrets"
                            style={{ marginTop: 15 }}
                            checked={overrideSecrets}
                            onChange={() => setOverrideSecrets(!overrideSecrets)}
                        />
                    </Message.Content>
                </Message>
            )}
            <Form>
                {selectedEnvironment.secrets.map(({ name, label, type, description }) => {
                    const handleBlur = () => {
                        onChange(secretInputs);
                    };
                    return (
                        <Form.Field key={name} label={label} help={description}>
                            <Form.Input
                                type={type}
                                name={name}
                                error={errors[name]}
                                value={secretInputs[name]}
                                onChange={setSecretInputs}
                                onBlur={handleBlur}
                                disabled={!overrideSecrets && allExistingSecretsKeys?.includes(name)}
                            />
                        </Form.Field>
                    );
                })}
            </Form>
        </>
    );
};

export default memo(SecretsStep);
