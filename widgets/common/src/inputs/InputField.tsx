import { DEFAULT_TEXTAREA_ROWS } from './consts';
import BlueprintIdInputField from './fields/BlueprintIdInputField';
import BooleanInputField from './fields/BooleanInputField';
import CapabilityValueInputField from './fields/CapabilityValueInputField';
import DeploymentIdInputField from './fields/DeploymentIdInputField';
import GenericInputField from './fields/GenericInputField';
import NumberInputField from './fields/NumberInputField';
import SecretKeyInputField from './fields/SecretKeyInputField';
import StringInputField from './fields/StringInputField';
import TextareaInputField from './fields/TextareaInputField';
import ValueListInputField from './fields/ValueListInputField';
import type { Constraint, Input, OnChange } from './types';

function getConstraintValueFunction(constraints: Constraint[]) {
    return (constraintName: string) => {
        if (_.isEmpty(constraints)) {
            return undefined;
        }
        const index = _.findIndex(constraints, constraintName);
        return index >= 0 ? constraints[index][constraintName] : null;
    };
}

function InputField({
    input,
    value,
    onChange,
    error,
    toolbox
}: {
    input: Input;
    value: any;
    onChange: OnChange;
    error: boolean;
    toolbox: Stage.Types.WidgetlessToolbox;
}) {
    const { name, default: defaultValue, type, constraints = [] } = input;

    const getConstraintValue = getConstraintValueFunction(constraints);
    const validValues = getConstraintValue('valid_values');

    const commonProps = {
        name,
        value,
        onChange,
        error,
        defaultValue
    };

    const commonDynamicDropdownFieldProps = {
        ...commonProps,
        toolbox,
        constraints
    };

    // Show only valid values in dropdown if 'valid_values' constraint is set
    if (!_.isUndefined(validValues) && !_.isNull(validValues)) {
        return <ValueListInputField {...commonProps} validValues={validValues} />;
    }

    switch (type) {
        case 'boolean':
            return <BooleanInputField {...commonProps} />;
        case 'integer':
        case 'float': {
            const inRange = getConstraintValue('in_range');
            const greaterThan = getConstraintValue('greater_than');
            const greaterOrEqual = getConstraintValue('greater_or_equal');
            const lessThan = getConstraintValue('less_than');
            const lessOrEqual = getConstraintValue('less_or_equal');

            return (
                <NumberInputField
                    {...commonProps}
                    constraints={{ inRange, greaterThan, greaterOrEqual, lessThan, lessOrEqual }}
                    type={type}
                />
            );
        }
        case 'textarea': {
            const rows = input?.display?.rows ?? DEFAULT_TEXTAREA_ROWS;
            return <TextareaInputField rows={rows} {...commonProps} />;
        }
        case 'deployment_id':
            return <DeploymentIdInputField {...commonDynamicDropdownFieldProps} />;
        case 'blueprint_id':
            return <BlueprintIdInputField {...commonDynamicDropdownFieldProps} />;
        case 'capability_value':
            return <CapabilityValueInputField {...commonDynamicDropdownFieldProps} />;
        case 'secret_key':
            return <SecretKeyInputField {...commonDynamicDropdownFieldProps} />;
        case 'string':
        case 'regex':
            return <StringInputField {...commonProps} />;
        default:
            return <GenericInputField {...commonProps} />;
    }
}

export default React.memo(InputField);
