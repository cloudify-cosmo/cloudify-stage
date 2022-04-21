import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function ScaleGroupInputField({
    name,
    onChange,
    toolbox,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = `/searches/scaling-groups?_include=name&deployment_id=${toolbox
        .getContext()
        .getValue('deploymentId')}`;

    return (
        <DynamicDropdown
            valueProp="name"
            placeholder={Stage.i18n.t('input.scaling_group.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
