import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import useFetchUrlWithDeploymentId from './useFetchUrlWithDeploymentId';

export default function NodeIdInputField({ name, onChange, toolbox, ...restProps }: DynamicDropdownInputFieldProps) {
    const fetchUrl = useFetchUrlWithDeploymentId('/searches/nodes?_include=id', restProps.constraints);

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
