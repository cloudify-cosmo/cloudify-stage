import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function NodeInstanceInputField({
    name,
    onChange,
    toolbox,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = `/searches/node-instances?deployment_id=${toolbox.getContext().getValue('deploymentId')}`;

    return (
        <DynamicDropdown
            placeholder={Stage.i18n.t('input.node_instance.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
