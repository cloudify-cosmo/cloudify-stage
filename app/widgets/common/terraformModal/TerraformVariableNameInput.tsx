import React from 'react';
import type { Variable } from 'backend/handler/TerraformHandler.types';
import type { CustomConfigurationComponentProps } from '../../../utils/StageAPI';
import DynamicDropdown from '../components/DynamicDropdown';
import type { VariableRow } from './TerraformModal';
import { inputMaxLength } from './TerraformModal';
import StageUtils from '../../../utils/stageUtils';
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
    widgetlessToolbox
}: TerraformVariableNameInputProps) {
    if (rowValues?.source === 'secret') {
        return (
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
        );
    }
    if (rowValues?.source === 'static' && name === 'name') {
        return <Form.Input value="" disabled fluid />;
    }

    return (
        <Form.Input
            value={value.value === null ? '' : value.value}
            onChange={(event, data) => onChange(event, { name, value: { value: data.value } })}
            fluid
        >
            <input maxLength={inputMaxLength} />
        </Form.Input>
    );
}
