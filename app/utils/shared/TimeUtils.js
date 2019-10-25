/**
 * Created by jakub.niezgoda on 06/02/2019.
 */

export default class TimeUtils {
    static formatTimestamp(timestamp, outputPattern = 'DD-MM-YYYY HH:mm', inputPattern = 'YYYY-MM-DD HH:mm:ss') {
        const timestampMoment = moment.utc(timestamp, inputPattern).local();
        return timestampMoment.isValid() ? timestampMoment.format(outputPattern) : '';
    }

    static formatLocalTimestamp(timestamp, outputPattern = 'DD-MM-YYYY HH:mm', inputPattern = undefined) {
        const timestampMoment = moment(timestamp, inputPattern);
        return timestampMoment.isValid() ? timestampMoment.format(outputPattern) : '';
    }
}
