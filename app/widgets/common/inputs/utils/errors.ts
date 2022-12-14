export function addErrors(inputsWithoutValues: Record<string, any>, errors: Record<string, any>) {
    _.forEach(_.keys(inputsWithoutValues), inputName => {
        errors[inputName] = `Please provide ${inputName}`;
    });
}

export function getErrorObject(message: string) {
    const constraintValidationMatch = message.match(/of input (.[^ ]+) violates constraint/);

    let errorFieldKey = 'error';
    if (constraintValidationMatch) {
        [, errorFieldKey] = constraintValidationMatch;
    }

    return { [errorFieldKey]: message };
}
