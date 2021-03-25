import React, { memo, useEffect, useState } from 'react';

import type { FC, ChangeEvent } from 'react';

import { Form } from '../../basic';

import type { GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';

// TODO(RD-1837): remove it after after forms will be changed to tsx version
const UnsafelyTypedForm = (Form as unknown) as FC<{ [x: string]: any }>;
// TODO(RD-1837): remove it after after forms will be changed to tsx version
const UnsafelyTypedFormField = (Form.Field as unknown) as FC<{ [x: string]: any }>;

type Props = {
    selectedTechnology: GettingStartedSchemaItem;
    typedSecrets?: GettingStartedSecretsData;
    onChange?: (typedSecrets: GettingStartedSecretsData) => void;
};

const SecretsStep = ({ selectedTechnology, typedSecrets, onChange }: Props) => {
    const [localTypedSecrets, setLocalTypedSecrets] = useState(typedSecrets ?? {});
    useEffect(() => setLocalTypedSecrets(typedSecrets ?? {}), [typedSecrets]);
    return (
        // TODO(RD-1837): change to <Form> after forms will be changed to tsx version
        <UnsafelyTypedForm>
            {selectedTechnology.secrets.map(({ name, label, type }) => {
                const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                    setLocalTypedSecrets({ ...localTypedSecrets, [name]: e.target.value });
                };
                const handleBlur = () => {
                    onChange?.(localTypedSecrets);
                };
                return (
                    // TODO(RD-1837): change to <Form.Field key={name}> after forms will be changed to tsx version
                    <UnsafelyTypedFormField key={name}>
                        <Form.Input
                            type={type}
                            label={label}
                            value={localTypedSecrets[name] ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {/* TODO(RD-1837): change to </Form.Field> after forms will be changed to tsx version  */}
                    </UnsafelyTypedFormField>
                );
            })}
            {/* TODO(RD-1837): change to </Form> after forms will be changed to tsx version  */}
        </UnsafelyTypedForm>
    );
};

export default memo(SecretsStep);
