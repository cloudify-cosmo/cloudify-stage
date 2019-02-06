/**
 * Created by jakub.niezgoda on 06/02/2019.
 */

export default class TimeUtils {
    static MAX_TIME_RESOLUTION_VALUE = 1000;
    static MIN_TIME_RESOLUTION_VALUE = 1;
    static TIME_RESOLUTION_UNITS = [
        {name: 'microseconds', text: 'microseconds', value: 'u'},
        {name: 'milliseconds', text: 'milliseconds', value: 'ms'},
        {name: 'seconds', text: 'seconds', value: 's'},
        {name: 'minutes', text: 'minutes', value: 'm'},
        {name: 'hours', text: 'hours', value: 'h'},
        {name: 'days', text: 'days', value: 'd'},
        {name: 'weeks', text: 'weeks', value: 'w'}
    ];

    static formatTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern='YYYY-MM-DD HH:mm:ss') {
        let timestampMoment = moment.utc(timestamp, inputPattern).local();
        return timestampMoment.isValid() ? timestampMoment.format(outputPattern) : '';
    }

    static formatLocalTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern=undefined) {
        let timestampMoment = moment(timestamp, inputPattern);
        return timestampMoment.isValid() ? timestampMoment.format(outputPattern) : '';
    }

}
