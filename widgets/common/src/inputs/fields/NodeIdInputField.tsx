import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';

export default function NodeIdInputField({ name, onChange, toolbox, ...restProps }: DynamicDropdownInputFieldProps) {
    const fetchUrl = `/searches/nodes?_include=id&deployment_id=${toolbox.getContext().getValue('deploymentId')}`;

    return (
        <DynamicDropdown
            name={name}
            placeholder={Stage.i18n.t('input.node_id.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
