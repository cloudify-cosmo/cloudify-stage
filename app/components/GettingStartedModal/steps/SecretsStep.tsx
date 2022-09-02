import React, { memo, useEffect, useMemo } from 'react';

import { Form } from '../../basic';
import { useInputs } from '../../../utils/hooks';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';
import StageUtils from '../../../utils/stageUtils';

type Props = {
    selectedEnvironment: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange: (typedSecrets: GettingStartedSecretsData) => void;
};

const t = StageUtils.getT('gettingStartedModal');

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
    const secretDescription = t('secretsDescription');
    const hasSecretDescrtiption = secretDescription;

    useEffect(() => resetSecretInputs(), [typedSecrets]);
    useEffect(() => {
        if (!typedSecrets) onChange(defaultSecretInputs);
    }, []);

    return (
        <Form>
            {selectedEnvironment.secrets.map(({ name, label, type }) => {
                const handleBlur = () => {
                    onChange(secretInputs);
                };
                return (
                    <Form.Field key={name} label={label} help={hasSecretDescrtiption ? secretDescription : undefined}>
                        <Form.Input
                            type={type}
                            name={name}
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
