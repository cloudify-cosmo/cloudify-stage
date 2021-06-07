/**
 * Created by jakubniezgoda on 03/03/2017.
 */

import _ from 'lodash';
import { types } from 'cloudify-ui-common';

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
        return types.toType(obj);
    }

    static toCloudifyType(obj) {
        return types.toCloudifyType(obj);
    }

    static getStringValue(value) {
        return types.getStringValue(value);
    }

    static getTypedValue(value) {
        return types.getTypedValue(value);
    }
}
