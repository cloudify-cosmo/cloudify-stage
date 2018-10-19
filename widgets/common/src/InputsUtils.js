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

        const stringValue = JsonUtils.getStringValue(value);
        const typedValue = _.startsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                           _.endsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR)
            ? stringValue.slice(1, -1)
            : JsonUtils.getTypedValue(value);

        const stringDefaultValue = InputsUtils.getInputFieldInitialValue(defaultValue);
        const typedDefaultValue = defaultValue;

        const revertToDefault = () => inputChangeFunction(null, {name, value: stringDefaultValue});

        return _.isNil(typedDefaultValue)
            ? undefined
            : <RevertToDefaultIcon value={typedValue} defaultValue={typedDefaultValue} onClick={revertToDefault} />;
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

        return _.includes(value, '\n')
            ?
            <Form.Group >
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

    static getInputsToSend(blueprintPlanInputs, inputsValues, inputsWithoutValues) {
        let {JsonUtils} = Stage.Common;
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs, (inputObj, inputName) => {
            let stringInputValue = inputsValues[inputName];
            let typedInputValue = JsonUtils.getTypedValue(stringInputValue);

            if (_.isEmpty(stringInputValue) && _.isNil(inputObj.default)) {
                inputsWithoutValues[inputName] = true;
            } else if (_.startsWith(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                       _.endsWith(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR)) {
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