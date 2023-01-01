import { STRING_VALUE_SURROUND_CHAR } from '../consts';

export default function getInputsMap(inputs: Record<string, any>, inputsValues: Record<string, any>) {
    const { Json } = Stage.Utils;
    const deploymentInputs: Record<string, string> = {};

    _.forEach(inputs, (inputObj, inputName) => {
        if (inputObj.hidden) return;

        const stringInputValue = Json.getStringValue(inputsValues[inputName]);
        let typedInputValue = Json.getTypedValue(inputsValues[inputName]);

        if (
            (!_.isEmpty(stringInputValue) || !_.isUndefined(inputObj.default)) &&
            _.startsWith(stringInputValue, STRING_VALUE_SURROUND_CHAR) &&
            _.endsWith(stringInputValue, STRING_VALUE_SURROUND_CHAR) &&
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
