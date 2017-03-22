/**
 * Created by jakubniezgoda on 03/03/2017.
 */

class JsonUtils {
    static stringify(value, indented = false) {
        if (_.isEmpty(value)) {
            return "";
        }

        let stringifiedValue = value;
        try {
            stringifiedValue = JSON.stringify(value, null, indented ? 2 : 0);
        } catch (e) {
            console.error(`Cannot parse value '${value}'. `, e);
        }

        return _.trim(stringifiedValue, '"');
    }
}

Stage.defineCommon({
    name: 'JsonUtils',
    common: JsonUtils
});