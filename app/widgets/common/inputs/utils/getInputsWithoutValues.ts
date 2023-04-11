import { forEach, isEmpty } from 'lodash';
import type { Origin } from '../types';

export default function getInputsWithoutValues(
    inputs: Record<string, any>,
    inputsValues: Record<string, any>,
    origin: Origin = 'deployment'
) {
    const { Json } = Stage.Utils;
    const inputsWithoutValues: Record<string, true> = {};

    forEach(inputs, (inputObj, inputName) => {
        if (inputObj.default !== undefined) return;
        if (origin === 'deployment' && (inputObj.required === false || inputObj.hidden)) return;

        const stringInputValue = Json.getStringValue(inputsValues[inputName]);

        if (isEmpty(stringInputValue)) {
            inputsWithoutValues[inputName] = true;
        }
    });

    return inputsWithoutValues;
}
