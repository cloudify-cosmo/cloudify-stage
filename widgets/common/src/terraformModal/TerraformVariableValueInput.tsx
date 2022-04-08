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

    return rowValues?.source === 'secret' ? (
        <DynamicDropdown
            fluid={false}
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
    ) : (
        <Input value={value === null ? '' : value} onChange={(event, data) => onChange(event, { name, ...data })}>
            <input maxLength={inputMaxLength} />
        </Input>
    );
}
