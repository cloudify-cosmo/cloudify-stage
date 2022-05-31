import React from 'react';
import type { CustomConfigurationComponentProps } from '../../../../app/utils/StageAPI';
import type { Variable } from '../../../../backend/routes/Terraform.types';
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
    widgetlessToolbox
}: TerraformVariableNameInputProps) {
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
    if (rowValues?.source === 'static' && name === 'name') {
        return <Input value="" disabled fluid />;
    }

    return (
        <Input value={value === null ? '' : value} onChange={(event, data) => onChange(event, { name, ...data })} fluid>
            <input maxLength={inputMaxLength} />
        </Input>
    );
}
