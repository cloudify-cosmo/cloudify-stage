import { forEach, isEmpty } from 'lodash';

export default function getInputsWithoutValues(inputs: Record<string, any>, inputsValues: Record<string, any>) {
    const { Json } = Stage.Utils;
    const inputsWithoutValues: Record<string, true> = {};

    forEach(inputs, (inputObj, inputName) => {
        if (inputObj.default !== undefined || inputObj.required === false || inputObj.hidden) return;

        const stringInputValue = Json.getStringValue(inputsValues[inputName]);

        if (isEmpty(stringInputValue)) {
            inputsWithoutValues[inputName] = true;
        }
    });

    return inputsWithoutValues;
}
