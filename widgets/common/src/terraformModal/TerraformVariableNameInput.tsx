import React from 'react';
import type { CustomConfigurationComponentProps } from '../../../../app/utils/StageAPI';
import type { Variable } from '../../../../backend/handler/TerraformHandler.types';
import DynamicDropdown from '../components/DynamicDropdown';
import { inputMaxLength } from './TerraformModal';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal.variablesTable');

interface TerraformVariableNameInputProps extends CustomConfigurationComponentProps<string> {
    rowValues?: Variable;
}

export default function TerraformVariableNameInput({
    rowValues,
    name,
    value,
    onChange,
    idPrefix,
    index,
    widgetlessToolbox
}: TerraformVariableNameInputProps) {
    const { Form } = Stage.Basic;

    const { useFormErrors } = Stage.Hooks;
    const { getFieldError } = useFormErrors('terraformModal');

    if (rowValues?.source === 'secret') {
        return (
            <Form.Field error={getFieldError(`${idPrefix}_${index}_${name}`)}>
                <DynamicDropdown
                    fluid
                    selection
                    value={value}
                    fetchUrl="/secrets"
                    onChange={newValue => onChange(undefined, { name, value: newValue as string })}
                    clearable={false}
                    toolbox={widgetlessToolbox}
                    valueProp="key"
                    allowAdditions
                    additionLabel={`${t('newSecretPrefix')} `}
                />
            </Form.Field>
        );
    }
    if (rowValues?.source === 'static' && name === 'name') {
        return <Form.Input error={getFieldError(`${idPrefix}_${index}_${name}`)} value="" disabled fluid />;
    }

    return (
        <Form.Input
            error={getFieldError(`${idPrefix}_${index}_${name}`)}
            value={value === null ? '' : value}
            onChange={(event, data) => onChange(event, { name, ...data })}
            fluid
        >
            <input maxLength={inputMaxLength} />
        </Form.Input>
    );
}
