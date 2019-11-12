/**
 * Created by jakubniezgoda on 03/03/2017.
 */

export default class JsonUtils {
    static stringify(value, indented = false, ignoreEmpty = false) {
        if (!ignoreEmpty && value === '') {
            return '';
        }

        let stringifiedValue = value;
        if (JsonUtils.toType(value) === 'object' || JsonUtils.toType(value) === 'array') {
            stringifiedValue = JSON.stringify(value, null, indented ? 2 : 0);
        }

        return _.trim(stringifiedValue, '"');
    }

    static toType(obj) {
        return {}.toString
            .call(obj)
            .match(/\s([a-zA-Z]+)/)[1]
            .toLowerCase();
    }

    static toCloudifyType(obj) {
        const type = JsonUtils.toType(obj);

        switch (type) {
            case 'boolean':
            case 'string':
                return type;
            case 'number':
                return _.isInteger(obj) ? 'integer' : 'float';
            case 'array':
                return 'list';
            case 'object':
                return 'dict';
            default:
                return undefined;
        }
    }

    static getStringValue(value) {
        let ret = null;

        switch (JsonUtils.toType(value)) {
            case 'array':
            case 'object':
                ret = JSON.stringify(value);
                break;
            case 'boolean':
            case 'string':
            case 'number':
            default:
                ret = String(value);
                break;
        }

        return ret;
    }

    static getTypedValue(value) {
        const initialType = JsonUtils.toType(value);

        if (initialType === 'string') {
            // Null or Undefined
            if (value === 'null') {
                return null;
            }
            if (value === 'undefined') {
                return undefined;
            }

            // Boolean
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }

            // Number
            const numericValue = Number(value);
            if (!isNaN(numericValue)) {
                return numericValue;
            }

            // Object or Array
            let jsonValue = null;
            try {
                jsonValue = JSON.parse(value);
            } catch (e) {
                return value;
            }

            return jsonValue;
        }
        return value;
    }
}
