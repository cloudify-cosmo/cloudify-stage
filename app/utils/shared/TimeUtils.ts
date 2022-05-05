import type { MomentFormatSpecification, MomentInput } from 'moment';
import moment from 'moment';

export default class TimeUtils {
    static formatTimestamp(
        timestamp: MomentInput,
        outputPattern = 'DD-MM-YYYY HH:mm',
        inputPattern: MomentFormatSpecification = 'YYYY-MM-DD HH:mm:ss'
    ) {
        const timestampMoment = moment.utc(timestamp, inputPattern).local();
        return timestampMoment.isValid() ? timestampMoment.format(outputPattern) : '';
    }

    static formatLocalTimestamp(
        timestamp: MomentInput,
        outputPattern = 'DD-MM-YYYY HH:mm',
        inputPattern: MomentFormatSpecification | undefined = undefined
    ) {
        const timestampMoment = moment(timestamp, inputPattern);
        return timestampMoment.isValid() ? timestampMoment.format(outputPattern) : '';
    }
}
