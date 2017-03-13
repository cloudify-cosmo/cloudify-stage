/**
 * Created by jakubniezgoda on 03/03/2017.
 */

class JsonUtils {
    static stringify(value, indented = false) {
        let stringifiedValue = '';

        try {
            stringifiedValue = JSON.stringify(value, null, indented ? 2 : 0);
        } catch (e) {
            console.error(`Cannot parse value '${value}'. `, e);
        }

        return stringifiedValue;
    }
}

Stage.defineCommon({
    name: 'JsonUtils',
    common: JsonUtils
});