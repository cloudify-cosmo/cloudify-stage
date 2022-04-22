import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function DeploymentIdInputField({
    name,
    value,
    onChange,
    constraints,
    error,
    toolbox
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/searches/deployments?_include=id,display_name';

    return (
        <DynamicDropdown
            name={name}
            error={error}
            textFormatter={Stage.Utils.formatDisplayName}
            placeholder={Stage.i18n.t('input.deployment_id.placeholder')}
            value={value}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            constraints={constraints}
        />
    );
}
