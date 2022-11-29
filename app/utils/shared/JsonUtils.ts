import _ from 'lodash';
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

        return _.trim(stringifiedValue, '"');
    }

    static toType: typeof types.toType = obj => {
        return types.toType(obj);
    };

    static toCloudifyType: typeof types.toCloudifyType = obj => {
        return types.toCloudifyType(obj);
    };

    static getStringValue: typeof types.getStringValue = (value: string) => {
        return types.getStringValue(value);
    };

    static getTypedValue: typeof types.getStringValue = value => {
        return types.getTypedValue(value);
    };
}
