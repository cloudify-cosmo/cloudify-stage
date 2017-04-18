/**
 * Created by kinneretzin on 02/03/2017.
 */

var TimeConsts = {
    MAX_TIME_RESOLUTION_VALUE: 1000,
    MIN_TIME_RESOLUTION_VALUE: 1,
    TIME_RESOLUTION_UNITS: [
        {name: 'microseconds', text: 'microseconds', value: 'u'},
        {name: 'milliseconds', text: 'milliseconds', value: 'ms'},
        {name: 'seconds', text: 'seconds', value: 's'},
        {name: 'minutes', text: 'minutes', value: 'm'},
        {name: 'hours', text: 'hours', value: 'h'},
        {name: 'days', text: 'days', value: 'd'},
        {name: 'weeks', text: 'weeks', value: 'w'}
    ]
};

Stage.defineCommon({
    name: 'TimeConsts',
    common: TimeConsts
});