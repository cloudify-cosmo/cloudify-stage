import React from 'react';
import type { CustomConfigurationComponentProps } from '../../../utils/StageAPI';
import type { Variable } from '../../../../backend/handler/TerraformHandler.types';
import DynamicDropdown from '../components/DynamicDropdown';
import type { VariableRow } from './TerraformModal';
import { inputMaxLength } from './TerraformModal';
import StageUtils from '../../../utils/stageUtils';
import { useFormErrors } from '../../../utils/hooks';
import { Form } from '../../../components/basic';

const t = StageUtils.getT('widgets.blueprints.terraformModal.variablesTable');

interface TerraformVariableNameInputProps extends CustomConfigurationComponentProps<VariableRow['name']> {
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
    const { getFieldError } = useFormErrors('terraformModal');

    if (rowValues?.source === 'secret') {
        return (
            <Form.Field error={getFieldError(`${idPrefix}_${index}_${name}`)}>
                <DynamicDropdown
                    fluid
                    selection
                    value={value.value}
                    fetchUrl="/secrets"
                    onChange={(newValue, added) =>
                        onChange(undefined, { name, value: { value: newValue as string, added } })
                    }
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
            onChange={(event, data) => onChange(event, { name, value: { value: data.value } })}
            fluid
        >
            <input maxLength={inputMaxLength} />
        </Form.Input>
    );
}
