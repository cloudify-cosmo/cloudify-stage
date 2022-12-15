import React from 'react';
import { Form } from '../../../components/basic';
import Help from './InputHelp';
import InputField from './InputField';
import getInputFieldInitialValue from './utils/getInputFieldInitialValue';
import type { DataType, Input, OnChange } from './types';
import type { SortOrder } from './SortOrderIcons';

function normalizeValue(input: Input, inputsState: Record<string, any>, dataType: DataType) {
    if ((input.type === 'integer' || input.type === 'float') && Number.isNaN(inputsState[input.name])) {
        return '';
    }
    if (_.isUndefined(inputsState[input.name])) {
        return getInputFieldInitialValue(input.default, input.type, dataType);
    }
    return inputsState[input.name];
}

function FormField({
    input,
    value,
    onChange,
    error,
    toolbox,
    dataType
}: {
    input: Input;
    value: any;
    onChange: OnChange;
    error: boolean;
    toolbox: Stage.Types.WidgetlessToolbox;
    dataType: DataType;
}) {
    const { name, display_label: displayLabel, default: defaultValue, description, type, constraints } = input;
    const help = (
        <Help
            description={description}
            type={type}
            constraints={constraints}
            defaultValue={defaultValue}
            dataType={dataType}
        />
    );
    const required = _.isUndefined(defaultValue);
    const booleanType = type === 'boolean';

    return (
        <Form.Field
            key={name}
            error={booleanType ? null : error}
            help={help}
            required={required}
            label={booleanType ? null : displayLabel ?? name}
        >
            <InputField input={input} value={value} onChange={onChange} error={error} toolbox={toolbox} />
        </Form.Field>
    );
}

interface InputFieldsProps {
    inputs: Record<string, any>;
    onChange: OnChange;
    inputsState: Record<string, any>;
    errorsState: Record<string, any>;
    toolbox: Stage.Types.WidgetlessToolbox;
    dataTypes?: Record<string, any>;
    sortOrder?: SortOrder;
}
export default function InputFields({
    inputs,
    onChange,
    inputsState,
    errorsState,
    toolbox,
    dataTypes,
    sortOrder = 'original'
}: InputFieldsProps) {
    const iteratee: 'name' | undefined = sortOrder !== 'original' ? 'name' : undefined;
    const order: 'desc' | undefined = sortOrder === 'descending' ? 'desc' : undefined;

    const inputFields = _(inputs)
        .map((input, name) => ({ name, ...input }))
        .reject('hidden')
        .orderBy(iteratee, order)
        .map(input => {
            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes![input.type] : undefined;
            const value = normalizeValue(input, inputsState, dataType);
            return (
                <FormField
                    input={input}
                    value={value}
                    onChange={onChange}
                    error={errorsState[input.name]}
                    toolbox={toolbox}
                    dataType={dataType}
                />
            );
        })
        .value();

    return <>{inputFields}</>;
}
