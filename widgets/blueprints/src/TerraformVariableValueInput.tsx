import React from 'react';
import { CustomConfigurationComponentProps } from '../../../app/utils/StageAPI';
import type { Variable } from '../../../backend/routes/Terraform.types';
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
    const { DynamicDropdown } = Stage.Common;

    return rowValues?.source === 'secret' ? (
        <DynamicDropdown
            fluid={false}
            selection
            value={value}
            fetchUrl="/secrets"
            onChange={newValue => onChange(null, { name, value: newValue as string })}
            clearable={false}
            toolbox={widgetlessToolbox}
            valueProp="key"
            allowAdditions
            additionLabel={`${t('newSecretPrefix')} `}
        />
    ) : (
        <Input value={value === null ? '' : value} onChange={(event, data) => onChange(event, { name, ...data })}>
            <input maxLength={inputMaxLength} />
        </Input>
    );
}
