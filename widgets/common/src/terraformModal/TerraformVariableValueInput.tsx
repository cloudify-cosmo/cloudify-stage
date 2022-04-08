import React from 'react';
import type { CustomConfigurationComponentProps } from '../../../../app/utils/StageAPI';
import type { Variable } from '../../../../backend/routes/Terraform.types';
import DynamicDropdown from '../components/DynamicDropdown';
import { inputMaxLength } from './TerraformModal';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal.variablesTable');

interface TerraformVariableValueInputProps extends CustomConfigurationComponentProps<string> {
    rowValues?: Variable;
}

export default function TerraformVariableValueInput({
    rowValues,
    name,
    value,
    onChange,
    widgetlessToolbox
}: TerraformVariableValueInputProps) {
    const { Input } = Stage.Basic;

    if (rowValues?.source === 'secret') {
        return (
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
        );
    }
    if (rowValues?.source === 'static' && name === 'value') {
        return <Input value="" disabled fluid />;
    }

    return (
        <Input value={value === null ? '' : value} onChange={(event, data) => onChange(event, { name, ...data })} fluid>
            <input maxLength={inputMaxLength} />
        </Input>
    );
}
