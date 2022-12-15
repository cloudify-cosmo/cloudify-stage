export default function getPlanForUpdate(plan: any, inputsValues: Record<string, any>) {
    const newPlan = _.cloneDeep(plan);

    _.forEach(newPlan, (_inputObj, inputName) => {
        if (!_.isUndefined(inputsValues[inputName]) && !_.isUndefined(newPlan[inputName].default)) {
            newPlan[inputName].default = inputsValues[inputName];
        }
    });

    return newPlan;
}
