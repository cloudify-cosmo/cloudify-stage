import getInputFieldInitialValue from './getInputFieldInitialValue';

export default function getInputsInitialValues(plan: {
    // eslint-disable-next-line camelcase
    data_types: Record<string, any>;
    inputs: Record<string, any>;
}) {
    const inputs: Record<string, any> = {};

    _.forEach(plan.inputs, (inputObj, inputName) => {
        const dataType = !_.isEmpty(plan.data_types) && !!inputObj.type ? plan.data_types[inputObj.type] : undefined;
        inputs[inputName] = getInputFieldInitialValue(inputObj.default, inputObj.type, dataType);
    });

    return inputs;
}
