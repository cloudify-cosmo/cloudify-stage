/**
 * Created by jakubniezgoda on 03/03/2017.
 */

class JsonUtils {
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

    // Attempts to parse string to json.
    // Returns original value if failed
    static stringToJson(value) {
        try{
            return JSON.parse(value);
        } catch (err) {
            return value;
        }
    }

    static toType(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
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
        let initialType = JsonUtils.toType(value);

        if (initialType === 'string') {
            // Boolean
            if (value === 'true') {
                return true;
            } else if (value === 'false') {
                return false;
            }

            // Number
            let numericValue = Number(value);
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

        } else {
            return value;
        }
    }
}

Stage.defineCommon({
    name: 'JsonUtils',
    common: JsonUtils
});