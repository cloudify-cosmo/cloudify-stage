import getHelp from './getHelp';
import getInputField from './getInputField';
import getInputFieldInitialValue from './getInputFieldInitialValue';
import type { DataType, Input, OnChange } from './types';

function normalizeValue(input: Input, inputsState: Record<string, any>, dataType: DataType) {
    if ((input.type === 'integer' || input.type === 'float') && Number.isNaN(inputsState[input.name])) {
        return '';
    }
    if (_.isUndefined(inputsState[input.name])) {
        return getInputFieldInitialValue(input.default, input.type, dataType);
    }
    return inputsState[input.name];
}

function getFormInputField(input: Input, value: any, onChange: OnChange, error: boolean, dataType: DataType) {
    const { name, display_label: displayLabel, default: defaultValue, description, type, constraints } = input;
    const { Form } = Stage.Basic;
    const help = getHelp(description, type, constraints, defaultValue, dataType);
    const required = _.isUndefined(defaultValue);

    switch (type) {
        case 'boolean':
            return (
                <Form.Field key={name} help={help} required={required}>
                    {getInputField(input, value, onChange, error)}
                </Form.Field>
            );
        case 'integer':
            return (
                <Form.Field key={name} error={error} help={help} required={required} label={displayLabel ?? name}>
                    {getInputField(input, value, onChange, error)}
                </Form.Field>
            );
        case 'string':
        default:
            return (
                <Form.Field key={name} error={error} help={help} required={required} label={displayLabel ?? name}>
                    {getInputField(input, value, onChange, error)}
                </Form.Field>
            );
    }
}

export default function getInputFields(
    inputs: Record<string, any>,
    onChange: OnChange,
    inputsState: Record<string, any>,
    errorsState: Record<string, any>,
    dataTypes?: Record<string, any>
) {
    return _(inputs)
        .map((input, name) => ({ name, ...input }))
        .reject('hidden')
        .sortBy([input => !_.isUndefined(input.default), 'name'])
        .map(input => {
            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes![input.type] : undefined;
            const value = normalizeValue(input, inputsState, dataType);
            return getFormInputField(input, value, onChange, errorsState[input.name], dataType);
        })
        .value();
}
