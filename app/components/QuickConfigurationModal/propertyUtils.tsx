export const getObjectProperty = (object: any, propertyPath?: string | null) => {
    if (propertyPath === undefined || propertyPath === null) {
        return object;
    }
    const pathParts = propertyPath.split('.');
    return pathParts.reduce((currentObject, currentKey) => currentObject?.[currentKey], object);
};

export const setObjectProperty = (object: any, propertyPath: string, propertyValue: any) => {
    const pathParts = propertyPath.split('.');
    const lastIndex = pathParts.length - 1;
    let currentObject = object;
    for (let i = 0; i < lastIndex; i += 1) {
        const currentKey = pathParts[i];
        currentObject = currentObject[currentKey] ?? (currentObject[currentKey] = {});
    }
    const currentKey = pathParts[lastIndex];
    currentObject[currentKey] = propertyValue;
};
