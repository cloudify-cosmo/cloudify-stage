import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function DeploymentIdInputField({
    name,
    value,
    onChange,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/searches/deployments?_include=id,display_name';

    return (
        <DynamicDropdown
            name={name}
            textFormatter={item => Stage.Utils.formatDisplayName({ id: item.id, displayName: item.display_name })}
            placeholder={Stage.i18n.t('input.deployment_id.placeholder')}
            value={value}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            {...restProps}
        />
    );
}
