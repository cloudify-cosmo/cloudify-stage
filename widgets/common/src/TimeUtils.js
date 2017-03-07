/**
 * Created by jakubniezgoda on 07/03/2017.
 */

class TimeUtils {
    static formatTimestamp(timestamp) {
        return moment(timestamp, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm');
    }
}

Stage.defineCommon({
    name: 'TimeUtils',
    common: TimeUtils
});