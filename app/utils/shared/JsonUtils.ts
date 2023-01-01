import { trim } from 'lodash';
import { types } from 'cloudify-ui-common-frontend';

export default class JsonUtils {
    static stringify(value: any, indented = false, ignoreEmpty = false) {
        if (!ignoreEmpty && value === '') {
            return '';
        }

        let stringifiedValue = value;
        if (JsonUtils.toType(value) === 'object' || JsonUtils.toType(value) === 'array') {
            stringifiedValue = JSON.stringify(value, null, indented ? 2 : 0);
        }

        return trim(stringifiedValue, '"');
    }

    static toType = types.toType;

    static toCloudifyType = types.toCloudifyType;

    static getStringValue = types.getStringValue;

    static getTypedValue = types.getTypedValue;
}
