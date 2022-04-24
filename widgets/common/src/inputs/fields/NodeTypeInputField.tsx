import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function NodeTypeInputField({ name, onChange, toolbox, ...restProps }: DynamicDropdownInputFieldProps) {
    const fetchUrl = `/searches/node-types?_include=type&deployment_id=${toolbox
        .getContext()
        .getValue('deploymentId')}`;

    return (
        <DynamicDropdown
            valueProp="type"
            placeholder={Stage.i18n.t('input.node_type.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
