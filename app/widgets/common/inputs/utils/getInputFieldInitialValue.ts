import getTemplateForDataType from './getTemplateForDataType';
import type { DataType } from '../types';

const EMPTY_STRING = '""';
const DEFAULT_INITIAL_VALUE_FOR_LIST = '[]';
const DEFAULT_INITIAL_VALUE_FOR_DICT = '{}';
const DEFAULT_INITIAL_VALUE = '';

function getEnhancedStringValue(value: any) {
    const { Json } = Stage.Utils;
    let stringValue = Json.getStringValue(value);

    if (stringValue === '') {
        return EMPTY_STRING;
    }
    const valueType = Json.toType(value);
    const castedValue = Json.getTypedValue(stringValue);
    const castedValueType = Json.toType(castedValue);

    if (valueType !== castedValueType) {
        stringValue = `"${stringValue}"`;
    }

    return stringValue;
}

export default function getInputFieldInitialValue(defaultValue: any, type?: string, dataType?: DataType) {
    const { Json } = Stage.Utils;

    if (_.isUndefined(defaultValue)) {
        switch (type) {
            case 'list':
                return DEFAULT_INITIAL_VALUE_FOR_LIST;
            case 'dict':
                return DEFAULT_INITIAL_VALUE_FOR_DICT;
            case 'boolean':
            case 'integer':
            case 'float':
            case 'string':
            default:
                return !_.isUndefined(dataType) ? getTemplateForDataType(dataType, true) : DEFAULT_INITIAL_VALUE;
        }
    } else {
        switch (type) {
            case 'boolean':
            case 'integer':
            case 'float':
                return defaultValue;
            case 'list':
            case 'dict':
                return Json.getStringValue(defaultValue);
            case 'string':
            default:
                return getEnhancedStringValue(defaultValue);
        }
    }
}
