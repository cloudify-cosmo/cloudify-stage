import React, { memo, useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';

import type { ChangeEvent } from 'react';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';

type Props = {
    selectedTechnology: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange?: (typedSecrets: GettingStartedSecretsData) => void;
};

const SecretsStep = ({ selectedTechnology, typedSecrets, onChange }: Props) => {
    const [localTypedSecrets, setLocalTypedSecrets] = useState(() => typedSecrets ?? {});
    useEffect(() => setLocalTypedSecrets(typedSecrets ?? {}), [typedSecrets]);
    return (
        <Form>
            <div>
                {selectedTechnology.secrets.map(({ name, label, type }) => {
                    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                        setLocalTypedSecrets({ ...localTypedSecrets, [name]: e.target.value });
                    };
                    const handleBlur = () => {
                        onChange?.(localTypedSecrets);
                    };
                    return (
                        <Form.Field key={name}>
                            <Form.Input
                                type={type}
                                label={label}
                                value={localTypedSecrets[name] ?? ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Field>
                    );
                })}
            </div>
        </Form>
    );
};

export default memo(SecretsStep);
