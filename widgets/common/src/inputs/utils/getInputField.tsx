import type { IconProps } from 'semantic-ui-react';
import DynamicDropdown from '../../components/DynamicDropdown';
import RevertToDefaultIcon from '../../components/RevertToDefaultIcon';
import { DEFAULT_TEXTAREA_ROWS, STRING_VALUE_SURROUND_CHAR } from './consts';
import getInputFieldInitialValue from './getInputFieldInitialValue';
import type { Constraint, Input, OnChange } from './types';

function getRevertToDefaultIcon(
    name: string,
    value: any,
    defaultValue: any,
    inputChangeFunction: IconProps['onClick']
) {
    const { Json } = Stage.Utils;

    const stringValue = Json.getStringValue(value);
    const typedValue =
        _.startsWith(stringValue, STRING_VALUE_SURROUND_CHAR) &&
        _.endsWith(stringValue, STRING_VALUE_SURROUND_CHAR) &&
        _.size(stringValue) > 1
            ? stringValue.slice(1, -1)
            : Json.getTypedValue(value);

    const typedDefaultValue = defaultValue;
    const cloudifyTypedDefaultValue = getInputFieldInitialValue(defaultValue, Json.toCloudifyType(typedDefaultValue));

    const revertToDefault = () => inputChangeFunction(null, { name, value: cloudifyTypedDefaultValue });

    return _.isUndefined(typedDefaultValue) ? undefined : (
        <RevertToDefaultIcon value={typedValue} defaultValue={typedDefaultValue} onClick={revertToDefault} />
    );
}

function getConstraintValueFunction(constraints: Constraint[]) {
    return (constraintName: string) => {
        if (_.isEmpty(constraints)) {
            return undefined;
        }
        const index = _.findIndex(constraints, constraintName);
        return index >= 0 ? constraints[index][constraintName] : null;
    };
}

export default function getInputField(
    input: Input,
    value: any,
    onChange: OnChange,
    error: boolean,
    toolbox: Stage.Types.WidgetlessToolbox
) {
    const { name, default: defaultValue, type, constraints = [] } = input;
    const { Form } = Stage.Basic;
    const getConstraintValue = getConstraintValueFunction(constraints);
    const validValues = getConstraintValue('valid_values');

    // Show only valid values in dropdown if 'valid_values' constraint is set
    if (!_.isUndefined(validValues) && !_.isNull(validValues)) {
        const options = _.map(validValues, validValue => ({
            name: validValue,
            text: validValue,
            value: validValue
        }));

        return (
            <div style={{ position: 'relative' }}>
                <Form.Dropdown
                    name={name}
                    value={value}
                    fluid
                    selection
                    error={error}
                    options={options}
                    onChange={onChange}
                />
                <div style={{ position: 'absolute', top: 10, right: 30 }}>
                    {getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                </div>
            </div>
        );
    }

    switch (type) {
        case 'boolean': {
            const isBooleanValue = value === false || value === true;
            const checked = isBooleanValue ? value : undefined;

            return (
                <>
                    <Form.Checkbox
                        name={name}
                        toggle
                        label={name}
                        checked={checked}
                        indeterminate={!isBooleanValue}
                        onChange={onChange}
                        help={undefined}
                    />
                    &nbsp;&nbsp;&nbsp;
                    {getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                </>
            );
        }
        case 'integer':
        case 'float': {
            // Limit numerical values if at least one of range limitation constraints is set
            const inRange = getConstraintValue('in_range');
            const greaterThan = getConstraintValue('greater_than');
            const greaterOrEqual = getConstraintValue('greater_or_equal');
            const lessThan = getConstraintValue('less_than');
            const lessOrEqual = getConstraintValue('less_or_equal');

            const min = _.max([inRange ? inRange[0] : null, greaterThan, greaterOrEqual]);
            const max = _.min([inRange ? inRange[1] : null, lessThan, lessOrEqual]);

            return (
                <Form.Input
                    name={name}
                    value={value}
                    fluid
                    error={!!error}
                    type="number"
                    step={type === 'integer' ? 1 : 'any'}
                    min={min}
                    max={max}
                    icon={getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    onChange={onChange}
                />
            );
        }
        case 'dict':
        case 'list':
            return (
                <div style={{ position: 'relative' }}>
                    <Form.Json name={name} value={value} onChange={onChange} error={!!error} />
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        {getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </div>
                </div>
            );
        case 'textarea': {
            const rows = input?.display?.rows ?? DEFAULT_TEXTAREA_ROWS;

            return (
                <div style={{ position: 'relative' }}>
                    <Form.TextArea name={name} value={value} onChange={onChange} rows={rows} />
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        {getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </div>
                </div>
            );
        }
        case 'deployment_id': {
            const fetchUrl = '/searches/deployments?_include=id,display_name';

            return (
                <DynamicDropdown
                    name={name}
                    error={!!error}
                    textFormatter={item =>
                        item.display_name !== item.id ? `${item.display_name} (${item.id})` : item.id
                    }
                    placeholder={Stage.i18n.t('input.deployment_id.placeholder')}
                    value={value}
                    fetchUrl={fetchUrl}
                    onChange={newValue => onChange?.(null, { name, value: newValue })}
                    toolbox={toolbox}
                    constraints={constraints}
                />
            );
        }
        case 'blueprint_id': {
            const fetchUrl = '/searches/blueprints?_include=id&state=uploaded';

            return (
                <DynamicDropdown
                    name={name}
                    error={!!error}
                    placeholder={Stage.i18n.t('input.blueprint_id.placeholder')}
                    value={value}
                    fetchUrl={fetchUrl}
                    onChange={newValue => onChange?.(null, { name, value: newValue })}
                    toolbox={toolbox}
                    constraints={constraints}
                />
            );
        }
        case 'capability_value': {
            const fetchUrl = '/searches/capabilities';

            // Formatting returned deployments to capabilities.
            const itemsFormatter = (deployments: any) =>
                deployments?.[0]?.capabilities?.map((capability: Record<string, any>) => ({
                    ...Object.values(capability)[0]
                })) ?? [];

            return (
                <DynamicDropdown
                    name={name}
                    error={!!error}
                    placeholder={Stage.i18n.t('input.capability_value.placeholder')}
                    itemsFormatter={itemsFormatter}
                    value={value}
                    valueProp="value"
                    fetchUrl={fetchUrl}
                    onChange={newValue => onChange?.(null, { name, value: newValue })}
                    toolbox={toolbox}
                    constraints={constraints}
                />
            );
        }
        case 'secret_key': {
            const fetchUrl = '/searches/secrets?_include=key';

            return (
                <DynamicDropdown
                    name={name}
                    error={!!error}
                    placeholder={Stage.i18n.t('input.secret_key.placeholder')}
                    value={value}
                    valueProp="key"
                    fetchUrl={fetchUrl}
                    onChange={newValue => onChange?.(null, { name, value: newValue })}
                    toolbox={toolbox}
                    constraints={constraints}
                />
            );
        }
        case 'string':
        case 'regex':
            return _.includes(value, '\n') ? (
                <div style={{ position: 'relative' }}>
                    <Form.TextArea name={name} value={value} onChange={onChange} />
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        {getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </div>
                </div>
            ) : (
                <Form.Input
                    name={name}
                    value={value}
                    fluid
                    error={!!error}
                    icon={getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    onChange={onChange}
                />
            );
        default:
            return (
                <div style={{ position: 'relative' }}>
                    <Form.Json name={name} value={value} onChange={onChange} error={!!error} />
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        {getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </div>
                </div>
            );
    }
}
