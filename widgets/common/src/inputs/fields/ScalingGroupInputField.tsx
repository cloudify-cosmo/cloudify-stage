import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import useFetchUrlWithDeploymentId from './useFetchUrlWithDeploymentId';

export default function ScalingGroupInputField({
    name,
    onChange,
    toolbox,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = useFetchUrlWithDeploymentId('/searches/scaling-groups?_include=name', restProps.constraints);

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
