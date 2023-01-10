import getInputFieldInitialValue from './getInputFieldInitialValue';

function validateInputTypes(plan: Record<string, any>, inputs: Record<string, any>) {
    const errors: string[] = [];
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

export default function getUpdatedInputs(
    plan: Record<string, any>,
    currentValues: Record<string, any>,
    newValues: Record<string, any>
) {
    const inputs: Record<string, string> = {};

    validateInputTypes(plan, newValues);

    _.forEach(plan, (inputObj, inputName) => {
        const newValue = newValues[inputName];
        const currentValue = currentValues[inputName];

        if (_.isUndefined(newValue)) {
            inputs[inputName] = currentValue;
        } else {
            inputs[inputName] = getInputFieldInitialValue(newValue, inputObj.type);
        }
    });

    return inputs;
}
