/**
 * Created by jakubniezgoda on 18/10/2018.
 */

class InputsUtils {

    static DEFAULT_VALUE_STRING = '';
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

    static getInputFieldInitialValue(defaultValue) {
        if (_.isNil(defaultValue)) {
            return InputsUtils.DEFAULT_VALUE_STRING;
        } else {
            return InputsUtils.getEnhancedStringValue(defaultValue);
        }
    }


    /* Components */

    static getRevertToDefaultIcon(name, value, defaultValue, inputChangeFunction) {
        let {RevertToDefaultIcon} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        const valueString = _.trim(JsonUtils.getStringValue(value), InputsUtils.STRING_VALUE_SURROUND_CHAR);
        const defaultValueString = JsonUtils.getStringValue(defaultValue);
        const revertToDefault = () => inputChangeFunction(null, {name, value: defaultValueString});

        return _.isNil(defaultValue)
            ? undefined
            : <RevertToDefaultIcon value={valueString}
                                   defaultValue={defaultValueString}
                                   onClick={revertToDefault} />;
    }

    static getFormInputField(name, value, defaultValue, description, onChange, error) {
        let {Form} = Stage.Basic;

        return (
            <Form.Field key={name} error={error} help={description} required={_.isNil(defaultValue)} label={name}>
                {InputsUtils.getInputField(name, value, defaultValue, onChange, error)}
            </Form.Field>
        );
    }

    static getInputField(name, value, defaultValue, onChange, error) {
        let {Form} = Stage.Basic;

        return (
            <Form.Input name={name} value={value} fluid error={error}
                        icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        onChange={onChange} />
        );
    }

    static getInputFields(blueprintPlanInputs, onChange, inputsState, errorsState) {
        let enhancedInputs
            = _.sortBy(
                _.map(blueprintPlanInputs, (input, name) => ({'name': name, ...input})),
                [(input => !_.isNil(input.default)), 'name']);

        return _.map(enhancedInputs, (input) =>
            InputsUtils.getFormInputField(input.name,
                                          inputsState[input.name],
                                          input.default,
                                          input.description,
                                          onChange,
                                          errorsState[input.name])
        );
    }


    /* Inputs for field values (string values) */

    static getInputsFromPlan(blueprintPlanInputs) {
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs, (inputObj, inputName) => {
            deploymentInputs[inputName] = InputsUtils.getInputFieldInitialValue(inputObj.default);
        });

        return deploymentInputs;
    }

    static getInputsFromYaml(blueprintPlanInputs, inputsValues, notFoundInputs) {
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs, (inputObj, inputName) => {
            let inputValue = inputsValues[inputName];

            if (_.isNil(inputValue) && _.isNil(inputObj.default)) {
                notFoundInputs.push(inputName);
            } else {
                deploymentInputs[inputName] = InputsUtils.getInputFieldInitialValue(inputValue);
            }
        });

        return deploymentInputs;
    }


    /* Inputs for REST API (typed values) */

    static getInputsToSend(blueprintPlanInputs, inputsValues, errors, inputsWithoutValues = {}) {
        let {JsonUtils} = Stage.Common;
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs, (inputObj, inputName) => {
            let stringInputValue = inputsValues[inputName];
            let typedInputValue = JsonUtils.getTypedValue(stringInputValue);

            if (_.isEmpty(stringInputValue) && _.isNil(inputObj.default)) {
                errors[inputName] = `Please provide ${inputName}`;
                inputsWithoutValues[inputName] = true;
            } else if (_.first(stringInputValue) === InputsUtils.STRING_VALUE_SURROUND_CHAR &&
                _.last(stringInputValue) === InputsUtils.STRING_VALUE_SURROUND_CHAR) {
                typedInputValue = _.trim(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR);
            }

            if (!_.isEqual(typedInputValue, inputObj.default)) {
                deploymentInputs[inputName] = typedInputValue;
            }
        });

        return deploymentInputs;
    }

}

Stage.defineCommon({
    name: 'InputsUtils',
    common: InputsUtils
});