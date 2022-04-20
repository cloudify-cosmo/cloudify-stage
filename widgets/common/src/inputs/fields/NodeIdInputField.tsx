import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function NodeIdInputField({
    name,
    value,
    onChange,
    constraints,
    error,
    toolbox
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = `/searches/nodes?_include=id&deployment_id=${toolbox.getContext().getValue('deploymentId')}`;

    return (
        <DynamicDropdown
            name={name}
            error={error}
            placeholder={Stage.i18n.t('input.node_id.placeholder')}
            value={value}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            constraints={constraints}
        />
    );
}
