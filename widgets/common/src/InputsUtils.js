/**
 * Created by jakubniezgoda on 18/10/2018.
 */

class InputsUtils {

    static DEFAULT_INITIAL_VALUE = '';

    static STRING_VALUE_SURROUND_CHAR = '"';
    static EMPTY_STRING = '""';


    /* Helper functions */

    static getEnhancedStringValue(value) {
        let {Json} = Stage.Utils;
        let stringValue = Json.getStringValue(value);

        if (stringValue === '') {
            return InputsUtils.EMPTY_STRING;
        } else {
            let valueType = Json.toType(value);
            let castedValue = Json.getTypedValue(stringValue);
            let castedValueType = Json.toType(castedValue);

            if (valueType !== castedValueType) {
                stringValue = `"${stringValue}"`;
            }

            return stringValue;
        }
    }

    static getInputFieldInitialValue(defaultValue, type = undefined) {
        if (_.isNil(defaultValue)) {
            return InputsUtils.DEFAULT_INITIAL_VALUE;
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
        let {Json} = Stage.Utils;

        const stringValue = Json.getStringValue(value);
        const typedValue = _.startsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                           _.endsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                           _.size(stringValue) > 1
            ? stringValue.slice(1, -1)
            : Json.getTypedValue(value);

        const typedDefaultValue = defaultValue;
        const cloudifyTypedDefaultValue = InputsUtils.getInputFieldInitialValue(defaultValue, Json.toCloudifyType(typedDefaultValue));

        const revertToDefault = () => inputChangeFunction(null, {name, value: cloudifyTypedDefaultValue});

        return _.isNil(typedDefaultValue)
            ? undefined
            : <RevertToDefaultIcon value={typedValue} defaultValue={typedDefaultValue} onClick={revertToDefault} />;
    }

    static getFormInputField(name, value, defaultValue, description, onChange, error, type, constraints) {
        let {Form, List} = Stage.Basic;

        let formattedDescription =
            <div>
                {
                    !_.isEmpty(description) &&
                    <React.Fragment>
                        <h4>Description</h4>
                        <p>{description}</p>
                    </React.Fragment>
                }
                {
                    !_.isEmpty(type) &&
                    <React.Fragment>
                        <h4>Type</h4>
                        <p>{type}</p>
                    </React.Fragment>
                }
                {
                    !_.isEmpty(constraints) &&
                    <React.Fragment>
                        <h4>Constraints</h4>
                        <List bulleted>
                            {
                                _.map(constraints, (constraint) => {
                                    const key = _.first(_.keys(constraint));
                                    return <List.Item key={key}>{_.capitalize(_.lowerCase(key))}: {String(constraint[key])}</List.Item>
                                })
                            }
                        </List>
                    </React.Fragment>
                }
            </div>;

        switch (type) {
            case 'boolean':
                return (
                    <Form.Field key={name} help={formattedDescription} required={_.isNil(defaultValue)}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type, constraints)}
                    </Form.Field>
                );
            case 'integer':
                return (
                    <Form.Field key={name} error={error} help={formattedDescription} required={_.isNil(defaultValue)} label={name}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type, constraints)}
                    </Form.Field>
                );
            case 'string':
            default:
                return (
                    <Form.Field key={name} error={error} help={formattedDescription} required={_.isNil(defaultValue)} label={name}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type, constraints)}
                    </Form.Field>
                );
        }
    }

    static getInputField(name, value, defaultValue, onChange, error, type, constraints) {
        let {Form} = Stage.Basic;
        let min, max;

        const getConstraintValue = (constraints, constraintName) => {
            const index = _.findIndex(constraints, constraintName);
            return (index >= 0)
                ? constraints[index][constraintName]
                : null;
        };

        if (!_.isEmpty(constraints)) {

            // Show only valid values in dropdown if 'valid_values' constraint is set
            const validValues = getConstraintValue(constraints, 'valid_values');
            if (!_.isNull(validValues)) {
                const options = _.map(validValues, (value) => ({name: value, text: value, value}));
                return (
                    <Form.Group>
                        <Form.Field width={16}>
                            <Form.Dropdown name={name} value={value} fluid selection error={!!error} options={options}
                                           onChange={onChange} />
                        </Form.Field>
                        <div style={{padding: '8px 0', margin: '0 auto'}}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </div>
                    </Form.Group>
                );
            }

            // Limit numerical values if at least one of range limitation constraints is set
            const inRange = getConstraintValue(constraints, 'in_range');
            const greaterThan = getConstraintValue(constraints, 'greater_than');
            const greaterOrEqual = getConstraintValue(constraints, 'greater_or_equal');
            const lessThan = getConstraintValue(constraints, 'less_than');
            const lessOrEqual = getConstraintValue(constraints, 'less_or_equal');

            min = _.max([inRange ? inRange[0] : null, greaterThan, greaterOrEqual]);
            max = _.min([inRange ? inRange[1] : null, lessThan, lessOrEqual]);
        }

        switch (type) {
            case 'boolean':
                const isBooleanValue = value === false || value === true;
                const checked = isBooleanValue ? value : undefined;
                return (
                    <React.Fragment>
                        <Form.Checkbox name={name} toggle label={name} checked={checked} indeterminate={!isBooleanValue}
                                       onChange={onChange} />
                        &nbsp;&nbsp;&nbsp;
                        {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </React.Fragment>
                );

            case 'integer':
                return <Form.Input name={name} value={value} fluid error={!!error} type='number' min={min} max={max}
                                   icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                                   onChange={onChange} />;

            case 'string':
            default:
                return _.includes(value, '\n') || type === 'list' || type === 'dict'
                    ?
                    <Form.Group>
                        <Form.Field width={16}>
                            <Form.TextArea name={name} value={value} onChange={onChange} />
                        </Form.Field>
                        <div style={{margin: '0 auto'}}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </div>
                    </Form.Group>
                    :
                    <Form.Input name={name} value={value} fluid error={!!error}
                                icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                                onChange={onChange} />;
        }
    }

    static getInputFields(inputs, onChange, inputsState, errorsState) {
        const enhancedInputs
            = _.sortBy(
                _.map(inputs, (input, name) => ({'name': name, ...input})),
                [(input => !_.isNil(input.default)), 'name']);

        return _.map(enhancedInputs, (input) => {
            const value = _.isNil(inputsState[input.name])
                ? InputsUtils.getInputFieldInitialValue(input.default, input.type)
                : inputsState[input.name];
            return InputsUtils.getFormInputField(input.name,
                                                 value,
                                                 input.default,
                                                 input.description,
                                                 onChange,
                                                 errorsState[input.name],
                                                 input.type,
                                                 input.constraints);
        });
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
                const inputValueType = Stage.Utils.Json.toCloudifyType(inputValue);
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

    static getPlanForUpdate(plan, inputsValues) {
        let newPlan = _.cloneDeep(plan);

        _.forEach(newPlan, (inputObj, inputName) => {
            if (!_.isUndefined(inputsValues[inputName]) && !_.isUndefined(newPlan[inputName].default)) {
                newPlan[inputName].default = inputsValues[inputName];
            }
        });

        return newPlan;
    }

    static getInputsToSend(inputs, inputsValues, inputsWithoutValues) {
        let {Json} = Stage.Utils;
        let deploymentInputs = {};

        _.forEach(inputs, (inputObj, inputName) => {
            let stringInputValue = String(inputsValues[inputName]);
            let typedInputValue = Json.getTypedValue(stringInputValue);

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

    static getErrorObject(message) {
        const typeValidationMatch = message.match(/Property type validation failed in '(.[^']+)'/);
        const propertyMissingMatch = message.match(/Value of input (.[^ ]+) is missing/);
        const constraintValidationMatch = message.match(/of input (.[^ ]+) violates constraint/);

        let errorFieldKey = 'error';
        if (typeValidationMatch) {
            errorFieldKey = typeValidationMatch[1];
        } else if (propertyMissingMatch) {
            errorFieldKey = propertyMissingMatch[1];
        } else if (constraintValidationMatch) {
            errorFieldKey = constraintValidationMatch[1];
        }

        return {[errorFieldKey]: message};
    }
}

Stage.defineCommon({
    name: 'InputsUtils',
    common: InputsUtils
});