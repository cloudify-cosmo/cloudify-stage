import _ from 'lodash';

export const getObjectProperty = (object: any, propertyPath?: string | null) => {
    return propertyPath == null ? object : _.get(object, propertyPath);
};

export const setObjectProperty = (object: any, propertyPath: string, propertyValue: any) => {
    _.set(object, propertyPath, propertyValue);
};
