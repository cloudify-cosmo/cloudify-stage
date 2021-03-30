import React, { memo, useEffect } from 'react';

import { Form } from '../../basic';
import { useInputs } from '../../../utils/hooks';
import { UnsafelyTypedForm, UnsafelyTypedFormField } from '../unsafelyTypedForm';

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
        // TODO(RD-1837): change to <Form> after forms will be changed to tsx version
        <UnsafelyTypedForm>
            {selectedTechnology.secrets.map(({ name, label, type }) => {
                const handleBlur = () => {
                    onChange?.(secretInputs);
                };
                return (
                    // TODO(RD-1837): change to <Form.Field key={name}> after forms will be changed to tsx version
                    <UnsafelyTypedFormField key={name}>
                        <Form.Input
                            type={type}
                            name={name}
                            label={label}
                            value={secretInputs[name] ?? ''}
                            onChange={setSecretInputs}
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
