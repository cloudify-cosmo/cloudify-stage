import React from 'react';
import { DEFAULT_TEXTAREA_ROWS } from './consts';
import BlueprintIdInputField from './fields/BlueprintIdInputField';
import BooleanInputField from './fields/BooleanInputField';
import CapabilityValueInputField from './fields/CapabilityValueInputField';
import DeploymentIdInputField from './fields/DeploymentIdInputField';
import GenericInputField from './fields/GenericInputField';
import NodeInstanceInputField from './fields/NodeInstanceInputField';
import NodeTypeInputField from './fields/NodeTypeInputField';
import NumberInputField from './fields/NumberInputField';
import ScalingGroupInputField from './fields/ScalingGroupInputField';
import SecretKeyInputField from './fields/SecretKeyInputField';
import StringInputField from './fields/StringInputField';
import TextareaInputField from './fields/TextareaInputField';
import ValueListInputField from './fields/ValueListInputField';
import NodeIdInputField from './fields/NodeIdInputField';
import getConstraintValueFunction from './utils/getConstraintValueFunction';

import type { Input, OnChange } from './types';
import OperationNameInputField from './fields/OperationNameInputField';

function isListComponentInputType(input: Input): boolean {
    return !!(input.item_type && input.type === 'list');
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
    const componentType = isListComponentInputType(input) ? input.item_type : type;
    const multiple = isListComponentInputType(input);

    const commonProps = {
        name,
        value: isListComponentInputType(input) && typeof value === 'string' ? JSON.parse(value) : value,
        onChange,
        error,
        defaultValue
    };

    const commonDynamicDropdownFieldProps = {
        ...commonProps,
        toolbox,
        constraints,
        multiple
    };

    // Show only valid values in dropdown if 'valid_values' constraint is set
    if (!_.isNil(validValues)) {
        return <ValueListInputField {...commonProps} multiple={multiple} validValues={validValues} />;
    }

    switch (componentType) {
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
                    type={componentType}
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
        case 'node_id':
            return <NodeIdInputField {...commonDynamicDropdownFieldProps} />;
        case 'node_instance':
            return <NodeInstanceInputField {...commonDynamicDropdownFieldProps} />;
        case 'scaling_group':
            return <ScalingGroupInputField {...commonDynamicDropdownFieldProps} />;
        case 'node_type':
            return <NodeTypeInputField {...commonDynamicDropdownFieldProps} />;
        case 'capability_value':
            return <CapabilityValueInputField {...commonDynamicDropdownFieldProps} />;
        case 'secret_key':
            return <SecretKeyInputField {...commonDynamicDropdownFieldProps} />;
        case 'operation_name':
            return <OperationNameInputField {...commonDynamicDropdownFieldProps} />;
        case 'string':
        case 'regex':
            return <StringInputField {...commonProps} />;
        case 'list':
        default:
            return <GenericInputField {...commonProps} />;
    }
}

export default React.memo(InputField);
