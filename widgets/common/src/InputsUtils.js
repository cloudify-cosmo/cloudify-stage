/**
 * Created by jakubniezgoda on 18/10/2018.
 */

class InputsUtils {

    static DEFAULT_VALUE_STRING = '';
    static DEFAULT_VALUE_NUMBER = 0;
    static DEFAULT_VALUE_BOOLEAN = false;

    static STRING_VALUE_SURROUND_CHAR = '"';
    static EMPTY_STRING = '""';


    /* Helper functions */

    static getEnhancedStringValue(value) {
        let {JsonUtils} = Stage.Common;
        let stringValue = JsonUtils.getStringValue(value);

        if (stringValue === '') {
            return InputsUtils.EMPTY_STRING;
        } else {
            let valueType = JsonUtils.toType(value);
            let castedValue = JsonUtils.getTypedValue(stringValue);
            let castedValueType = JsonUtils.toType(castedValue);

            if (valueType !== castedValueType) {
                stringValue = `"${stringValue}"`;
            }

            return stringValue;
        }
    }

    static getInputFieldInitialValue(defaultValue, type = undefined) {
        if (_.isNil(defaultValue)) {
            switch (type) {
                case 'boolean':
                    return InputsUtils.DEFAULT_VALUE_BOOLEAN;
                case 'integer':
                    return InputsUtils.DEFAULT_VALUE_NUMBER;
                case 'string':
                default:
                    return InputsUtils.DEFAULT_VALUE_STRING;
            }
        } else {
            switch (type) {
                case 'boolean':
                case 'integer':
                    return defaultValue;
                case 'string':
                default:
                    return InputsUtils.getEnhancedStringValue(defaultValue);
            }
        }
    }


    /* Components */

    static getRevertToDefaultIcon(name, value, defaultValue, inputChangeFunction) {
        let {RevertToDefaultIcon} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        const stringValue = JsonUtils.getStringValue(value);
        const typedValue = _.startsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                           _.endsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                           _.size(stringValue) > 1
            ? stringValue.slice(1, -1)
            : JsonUtils.getTypedValue(value);

        const typedDefaultValue = defaultValue;
        const cloudifyTypedDefaultValue = InputsUtils.getInputFieldInitialValue(defaultValue, JsonUtils.toCloudifyType(typedDefaultValue));

        const revertToDefault = () => inputChangeFunction(null, {name, value: cloudifyTypedDefaultValue});

        return _.isNil(typedDefaultValue)
            ? undefined
            : <RevertToDefaultIcon value={typedValue} defaultValue={typedDefaultValue} onClick={revertToDefault} />;
    }

    static getFormInputField(name, value, defaultValue, description, onChange, error, type) {
        let {Form} = Stage.Basic;

        switch (type) {
            case 'boolean':
                return (
                    <Form.Field key={name} help={description} required={_.isNil(defaultValue)}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type)}
                    </Form.Field>
                );
            case 'integer':
                return (
                    <Form.Field key={name} error={error} help={description} required={_.isNil(defaultValue)} label={name}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type)}
                    </Form.Field>
                );
            case 'string':
            default:
                return (
                    <Form.Field key={name} error={error} help={description} required={_.isNil(defaultValue)} label={name}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type)}
                    </Form.Field>
                );
        }
    }

    static getInputField(name, value, defaultValue, onChange, error, type) {
        let {Form} = Stage.Basic;

        switch (type) {
            case 'boolean':
                return (
                    <React.Fragment>
                        <Form.Checkbox name={name} toggle label={name} checked={value} onChange={onChange} />
                        &nbsp;&nbsp;&nbsp;
                        {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </React.Fragment>
                );

            case 'integer':
                return <Form.Input name={name} value={value} fluid error={!!error} type='number'
                                   icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                                   onChange={onChange} />;

            case 'string':
            default:
                return _.includes(value, '\n')
                    ?
                    <Form.Group>
                        <Form.Field width={15}>
                            <Form.TextArea name={name} value={value} onChange={onChange} />
                        </Form.Field>
                        <Form.Field width={1} style={{textAlign: 'center'}}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </Form.Field>
                    </Form.Group>
                    :
                    <Form.Input name={name} value={value} fluid error={!!error}
                                icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                                onChange={onChange} />;
        }
    }

    static getInputFields(inputs, onChange, inputsState, errorsState) {
        let enhancedInputs
            = _.sortBy(
                _.map(inputs, (input, name) => ({'name': name, ...input})),
                [(input => !_.isNil(input.default)), 'name']);

        return _.map(enhancedInputs, (input) =>
            InputsUtils.getFormInputField(input.name,
                                          inputsState[input.name] // Always return defined value to avoid rendering uncontrolled inputs
                                          || InputsUtils.getInputFieldInitialValue(undefined, input.type),
                                          input.default,
                                          input.description,
                                          onChange,
                                          errorsState[input.name],
                                          input.type)
        );
    }


    /* Inputs for field values (string values) */

    static getInputsInitialValuesFrom(plan) {
        let inputs = {};

        _.forEach(plan, (inputObj, inputName) => {
            inputs[inputName] = InputsUtils.getInputFieldInitialValue(inputObj.default, inputObj.type);
        });

        return inputs;
    }

    static validateInputTypes(plan, inputs) {
        let errors = [];
        let inputsAreValid = true;

        _.forEach(plan, (inputObj, inputName) => {
            const expectedValueType = inputObj.type;
            const inputValue = inputs[inputName];

            if (!_.isUndefined(expectedValueType) && !_.isUndefined(inputValue)) {
                const inputValueType = Stage.Common.JsonUtils.toCloudifyType(inputValue);
                if ((expectedValueType === 'boolean' || expectedValueType === 'integer') &&
                    (expectedValueType !== inputValueType)) {
                    errors.push(inputName);
                    inputsAreValid = false;
                }
            }
        });

        if (!inputsAreValid) {
            throw new Error(`The following fields have invalid types: ${_.join(errors, ', ')}.`);
        }
    }

    static getUpdatedInputs(plan, currentValues, newValues) {
        let inputs = {};

        InputsUtils.validateInputTypes(plan, newValues);

        _.forEach(plan, (inputObj, inputName) => {
            let newValue = newValues[inputName];
            let currentValue = currentValues[inputName];

            if (_.isNil(newValue)) {
                inputs[inputName] = currentValue;
            } else {
                inputs[inputName] = InputsUtils.getInputFieldInitialValue(newValue, inputObj.type);
            }
        });

        return inputs;
    }


    /* Inputs for REST API (typed values) */

    static getInputsToSend(inputs, inputsValues, inputsWithoutValues) {
        let {JsonUtils} = Stage.Common;
        let deploymentInputs = {};

        _.forEach(inputs, (inputObj, inputName) => {
            let stringInputValue = inputsValues[inputName];
            let typedInputValue = JsonUtils.getTypedValue(stringInputValue);

            if (_.isEmpty(stringInputValue) && _.isNil(inputObj.default)) {
                inputsWithoutValues[inputName] = true;
            } else if (_.startsWith(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                       _.endsWith(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                       _.size(stringInputValue) > 1) {
                typedInputValue = stringInputValue.slice(1, -1);
            }

            if (!_.isEqual(typedInputValue, inputObj.default)) {
                deploymentInputs[inputName] = typedInputValue;
            }
        });

        return deploymentInputs;
    }

    static addErrors(inputsWithoutValues, errors) {
        _.forEach(_.keys(inputsWithoutValues), (inputName) => errors[inputName] = `Please provide ${inputName}`);
    }

}

Stage.defineCommon({
    name: 'InputsUtils',
    common: InputsUtils
});