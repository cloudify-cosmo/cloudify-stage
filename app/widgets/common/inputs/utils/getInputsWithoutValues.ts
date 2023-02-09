export default function getInputsWithoutValues(inputs: Record<string, any>, inputsValues: Record<string, any>) {
    const { Json } = Stage.Utils;
    const inputsWithoutValues: Record<string, true> = {};

    _.forEach(inputs, (inputObj, inputName) => {
        if (inputObj.default !== undefined || inputObj.hidden || inputObj.required === false) return;

        const stringInputValue = Json.getStringValue(inputsValues[inputName]);

        if (_.isEmpty(stringInputValue)) {
            inputsWithoutValues[inputName] = true;
        }
    });

    return inputsWithoutValues;
}
