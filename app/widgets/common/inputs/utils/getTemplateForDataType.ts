import type { DataType } from '../types';

export default function getTemplateForDataType(dataType: DataType, stringTemplate?: boolean) {
    const getStringInitialValue = (type: string) => {
        switch (type) {
            case 'boolean':
                return 'true';
            case 'integer':
                return '0';
            case 'float':
                return '0.0';
            case 'string':
                return '"..."';
            case 'dict':
                return '{}';
            case 'list':
                return '[]';
            case 'regex':
                return '"regexp"';
            default:
                return '""';
        }
    };

    const { properties } = dataType;
    const propertiesList: string[] = [];
    _.map(properties, (propertyObject, propertyName) => {
        let propertyString = `"${propertyName}":`;
        if (!_.isUndefined(propertyObject.default)) {
            if (_.isString(propertyObject.default)) {
                propertyString += `"${propertyObject.default}"`;
            } else {
                const { Json } = Stage.Utils;
                propertyString += Json.getStringValue(propertyObject.default);
            }
        } else {
            propertyString += getStringInitialValue(propertyObject.type);
        }
        propertiesList.push(propertyString);
    });

    let template = `{${_.join(propertiesList, ',')}}`;
    if (!stringTemplate) {
        try {
            template = JSON.parse(template);
        } catch (error) {
            template = '{}';
        }
    }
    return template;
}
