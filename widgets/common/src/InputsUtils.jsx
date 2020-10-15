function RevertToDefaultIcon({ value, defaultValue, onClick }) {
    const { Icon, Popup } = Stage.Basic;

    return !_.isUndefined(defaultValue) && !_.isEqual(value, defaultValue) ? (
        <Popup trigger={<Icon name="undo" link onClick={onClick} />}>Revert to default value</Popup>
    ) : null;
}

RevertToDefaultIcon.propTypes = {
    /**
     * value typed field value
     */
    value: Stage.PropTypes.AnyDataType,

    /**
     * defaultValue typed field default value
     */
    defaultValue: Stage.PropTypes.AnyDataType,

    /**
     * onClick function to be called on revert icon click
     */
    onClick: PropTypes.func
};

RevertToDefaultIcon.defaultProps = {
    value: undefined, // value can be undefined
    defaultValue: undefined, // defaultValue can be undefined
    onClick: _.noop
};

const HelpProperty = ({ show, name, value }) => {
    const { Header } = Stage.Basic;
    return (
        show && (
            <>
                <Header as="h4">{name}</Header>
                <div>{value}</div>
            </>
        )
    );
};

HelpProperty.propTypes = {
    name: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    value: PropTypes.node
};

HelpProperty.defaultProps = {
    value: null
};

class InputsUtils {
    static DEFAULT_INITIAL_VALUE_FOR_LIST = '[]';

    static DEFAULT_INITIAL_VALUE_FOR_DICT = '{}';

    static DEFAULT_INITIAL_VALUE = '';

    static STRING_VALUE_SURROUND_CHAR = '"';

    static EMPTY_STRING = '""';

    /* Helper functions */

    static getEnhancedStringValue(value) {
        const { Json } = Stage.Utils;
        let stringValue = Json.getStringValue(value);

        if (stringValue === '') {
            return InputsUtils.EMPTY_STRING;
        }
        const valueType = Json.toType(value);
        const castedValue = Json.getTypedValue(stringValue);
        const castedValueType = Json.toType(castedValue);

        if (valueType !== castedValueType) {
            stringValue = `"${stringValue}"`;
        }

        return stringValue;
    }

    static getInputFieldInitialValue(defaultValue, type = undefined, dataType = undefined) {
        const { Json } = Stage.Utils;

        if (_.isUndefined(defaultValue)) {
            switch (type) {
                case 'list':
                    return InputsUtils.DEFAULT_INITIAL_VALUE_FOR_LIST;
                case 'dict':
                    return InputsUtils.DEFAULT_INITIAL_VALUE_FOR_DICT;
                case 'boolean':
                case 'integer':
                case 'float':
                case 'string':
                default:
                    return !_.isUndefined(dataType)
                        ? InputsUtils.getTemplateForDataType(dataType, true)
                        : InputsUtils.DEFAULT_INITIAL_VALUE;
            }
        } else {
            switch (type) {
                case 'boolean':
                case 'integer':
                case 'float':
                    return defaultValue;
                case 'list':
                case 'dict':
                    return Json.getStringValue(defaultValue);
                case 'string':
                default:
                    return InputsUtils.getEnhancedStringValue(defaultValue);
            }
        }
    }

    static getTemplateForDataType(dataType, stringTemplate) {
        const getStringInitialValue = type => {
            switch (type) {
                case 'boolean':
                    return 'true';
                case 'integer':
                    return '0';
                case 'float':
                    return '0.0';
                case 'string':
                    return '"..."';
                case 'dict':
                    return '{}';
                case 'list':
                    return '[]';
                case 'regex':
                    return '"regexp"';
                default:
                    return '""';
            }
        };

        const { properties } = dataType;
        const propertiesList = [];
        _.map(properties, (propertyObject, propertyName) => {
            let propertyString = `"${propertyName}":`;
            if (!_.isUndefined(propertyObject.default)) {
                if (_.isString(propertyObject.default)) {
                    propertyString += `"${propertyObject.default}"`;
                } else {
                    const { Json } = Stage.Utils;
                    propertyString += Json.getStringValue(propertyObject.default);
                }
            } else {
                propertyString += getStringInitialValue(propertyObject.type);
            }
            propertiesList.push(propertyString);
        });

        let template = `{${_.join(propertiesList, ',')}}`;
        if (!stringTemplate) {
            try {
                template = JSON.parse(template);
            } catch (error) {
                template = '{}';
            }
        }
        return template;
    }

    /* Components */

    static getRevertToDefaultIcon(name, value, defaultValue, inputChangeFunction) {
        const { Json } = Stage.Utils;

        const stringValue = Json.getStringValue(value);
        const typedValue =
            _.startsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
            _.endsWith(stringValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
            _.size(stringValue) > 1
                ? stringValue.slice(1, -1)
                : Json.getTypedValue(value);

        const typedDefaultValue = defaultValue;
        const cloudifyTypedDefaultValue = InputsUtils.getInputFieldInitialValue(
            defaultValue,
            Json.toCloudifyType(typedDefaultValue)
        );

        const revertToDefault = () => inputChangeFunction(null, { name, value: cloudifyTypedDefaultValue });

        return _.isUndefined(typedDefaultValue) ? undefined : (
            <RevertToDefaultIcon value={typedValue} defaultValue={typedDefaultValue} onClick={revertToDefault} />
        );
    }

    static getHelp(description, type, constraints, defaultValue, dataType) {
        const { List } = Stage.Basic;
        const { ParameterValue } = Stage.Common;

        let example = null;
        if (!_.isUndefined(defaultValue)) {
            example = defaultValue;
        } else if (!_.isUndefined(dataType)) {
            example = InputsUtils.getTemplateForDataType(dataType);
        }

        return (
            <div>
                <HelpProperty name="Description" show={!_.isEmpty(description)} value={description} />
                <HelpProperty name="Type" show={!_.isEmpty(type)} value={type} />
                <HelpProperty
                    name="Constraints"
                    show={!_.isEmpty(constraints)}
                    value={
                        <List bulleted>
                            {_.map(constraints, constraint => {
                                const key = _.first(_.keys(constraint));
                                return (
                                    <List.Item key={key}>
                                        {_.capitalize(_.lowerCase(key))}: {String(constraint[key])}
                                    </List.Item>
                                );
                            })}
                        </List>
                    }
                />
                <HelpProperty
                    name={!_.isUndefined(defaultValue) ? 'Default Value' : 'Example'}
                    show={!_.isUndefined(defaultValue) || !_.isUndefined(dataType)}
                    value={<ParameterValue value={example} />}
                />
            </div>
        );
    }

    static getFormInputField(name, value, defaultValue, description, onChange, error, type, constraints, dataType) {
        const { Form } = Stage.Basic;
        const help = InputsUtils.getHelp(description, type, constraints, defaultValue, dataType);
        const required = _.isUndefined(defaultValue);

        switch (type) {
            case 'boolean':
                return (
                    <Form.Field key={name} help={help} required={required}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type, constraints)}
                    </Form.Field>
                );
            case 'integer':
                return (
                    <Form.Field key={name} error={error} help={help} required={required} label={name}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type, constraints)}
                    </Form.Field>
                );
            case 'string':
            default:
                return (
                    <Form.Field key={name} error={error} help={help} required={required} label={name}>
                        {InputsUtils.getInputField(name, value, defaultValue, onChange, error, type, constraints)}
                    </Form.Field>
                );
        }
    }

    static getInputField(name, value, defaultValue, onChange, error, type, constraints) {
        const { Form } = Stage.Basic;
        let min;
        let max;

        if (!_.isEmpty(constraints)) {
            const getConstraintValue = constraintName => {
                const index = _.findIndex(constraints, constraintName);
                return index >= 0 ? constraints[index][constraintName] : null;
            };

            // Show only valid values in dropdown if 'valid_values' constraint is set
            const validValues = getConstraintValue('valid_values');
            if (!_.isNull(validValues)) {
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
                            error={!!error}
                            options={options}
                            onChange={onChange}
                        />
                        <div style={{ position: 'absolute', top: 10, right: 30 }}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </div>
                    </div>
                );
            }

            // Limit numerical values if at least one of range limitation constraints is set
            const inRange = getConstraintValue('in_range');
            const greaterThan = getConstraintValue('greater_than');
            const greaterOrEqual = getConstraintValue('greater_or_equal');
            const lessThan = getConstraintValue('less_than');
            const lessOrEqual = getConstraintValue('less_or_equal');

            min = _.max([inRange ? inRange[0] : null, greaterThan, greaterOrEqual]);
            max = _.min([inRange ? inRange[1] : null, lessThan, lessOrEqual]);
        }

        const isBooleanValue = value === false || value === true;
        const checked = isBooleanValue ? value : undefined;
        switch (type) {
            case 'boolean':
                return (
                    <>
                        <Form.Checkbox
                            name={name}
                            toggle
                            label={name}
                            checked={checked}
                            indeterminate={!isBooleanValue}
                            onChange={onChange}
                        />
                        &nbsp;&nbsp;&nbsp;
                        {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                    </>
                );

            case 'integer':
            case 'float':
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
                        icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        onChange={onChange}
                    />
                );

            case 'dict':
            case 'list':
                return (
                    <div style={{ position: 'relative' }}>
                        <Form.Json name={name} value={value} onChange={onChange} error={!!error} />
                        <div style={{ position: 'absolute', top: 10, right: 10 }}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </div>
                    </div>
                );

            case 'string':
            case 'regex':
                return _.includes(value, '\n') ? (
                    <div style={{ position: 'relative' }}>
                        <Form.TextArea name={name} value={value} onChange={onChange} />
                        <div style={{ position: 'absolute', top: 10, right: 10 }}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </div>
                    </div>
                ) : (
                    <Form.Input
                        name={name}
                        value={value}
                        fluid
                        error={!!error}
                        icon={InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        onChange={onChange}
                    />
                );

            default:
                return (
                    <div style={{ position: 'relative' }}>
                        <Form.Json name={name} value={value} onChange={onChange} error={!!error} />
                        <div style={{ position: 'absolute', top: 10, right: 10 }}>
                            {InputsUtils.getRevertToDefaultIcon(name, value, defaultValue, onChange)}
                        </div>
                    </div>
                );
        }
    }

    static getInputFields(inputs, onChange, inputsState, errorsState, dataTypes) {
        const enhancedInputs = _.sortBy(
            _.map(inputs, (input, name) => ({ name, ...input })),
            [input => !_.isUndefined(input.default), 'name']
        );

        return _.map(enhancedInputs, input => {
            const dataType = !_.isEmpty(dataTypes) && !!input.type ? dataTypes[input.type] : undefined;
            const value = _.isUndefined(inputsState[input.name])
                ? InputsUtils.getInputFieldInitialValue(input.default, input.type, dataType)
                : inputsState[input.name];
            return InputsUtils.getFormInputField(
                input.name,
                value,
                input.default,
                input.description,
                onChange,
                errorsState[input.name],
                input.type,
                input.constraints,
                dataType
            );
        });
    }

    /* Inputs for field values (string values) */

    static getInputsInitialValuesFrom(plan) {
        const inputs = {};

        _.forEach(plan.inputs, (inputObj, inputName) => {
            const dataType =
                !_.isEmpty(plan.data_types) && !!inputObj.type ? plan.data_types[inputObj.type] : undefined;
            inputs[inputName] = InputsUtils.getInputFieldInitialValue(inputObj.default, inputObj.type, dataType);
        });

        return inputs;
    }

    static validateInputTypes(plan, inputs) {
        const errors = [];
        let inputsAreValid = true;

        _.forEach(plan, (inputObj, inputName) => {
            const expectedValueType = inputObj.type;
            const inputValue = inputs[inputName];

            if (!_.isUndefined(expectedValueType) && !_.isUndefined(inputValue)) {
                const inputValueType = Stage.Utils.Json.toCloudifyType(inputValue);
                if (
                    (expectedValueType === 'boolean' || expectedValueType === 'integer') &&
                    expectedValueType !== inputValueType
                ) {
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
        const inputs = {};

        InputsUtils.validateInputTypes(plan, newValues);

        _.forEach(plan, (inputObj, inputName) => {
            const newValue = newValues[inputName];
            const currentValue = currentValues[inputName];

            if (_.isUndefined(newValue)) {
                inputs[inputName] = currentValue;
            } else {
                inputs[inputName] = InputsUtils.getInputFieldInitialValue(newValue, inputObj.type);
            }
        });

        return inputs;
    }

    /* Inputs for REST API (typed values) */

    static getPlanForUpdate(plan, inputsValues) {
        const newPlan = _.cloneDeep(plan);

        _.forEach(newPlan, (inputObj, inputName) => {
            if (!_.isUndefined(inputsValues[inputName]) && !_.isUndefined(newPlan[inputName].default)) {
                newPlan[inputName].default = inputsValues[inputName];
            }
        });

        return newPlan;
    }

    static getInputsToSend(inputs, inputsValues, inputsWithoutValues) {
        const { Json } = Stage.Utils;
        const deploymentInputs = {};

        _.forEach(inputs, (inputObj, inputName) => {
            const stringInputValue = Json.getStringValue(inputsValues[inputName]);
            let typedInputValue = Json.getTypedValue(inputsValues[inputName]);

            if (_.isEmpty(stringInputValue) && _.isUndefined(inputObj.default)) {
                inputsWithoutValues[inputName] = true;
            } else if (
                _.startsWith(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                _.endsWith(stringInputValue, InputsUtils.STRING_VALUE_SURROUND_CHAR) &&
                _.size(stringInputValue) > 1
            ) {
                typedInputValue = stringInputValue.slice(1, -1);
            }

            if (!_.isEqual(typedInputValue, inputObj.default)) {
                deploymentInputs[inputName] = typedInputValue;
            }
        });

        return deploymentInputs;
    }

    static addErrors(inputsWithoutValues, errors) {
        _.forEach(_.keys(inputsWithoutValues), inputName => {
            errors[inputName] = `Please provide ${inputName}`;
        });
    }

    static getErrorObject(message) {
        const constraintValidationMatch = message.match(/of input (.[^ ]+) violates constraint/);

        let errorFieldKey = 'error';
        if (constraintValidationMatch) {
            [, errorFieldKey] = constraintValidationMatch;
        }

        return { [errorFieldKey]: message };
    }
}

Stage.defineCommon({
    name: 'InputsUtils',
    common: InputsUtils
});
