/**
 * Created by pawelposel on 09/11/2016.
 */

export default class StageUtils {

    static makeCancelable(promise) {
        let hasCanceled_ = false;

        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then((val) =>
                hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
            );
            promise.catch((error) =>
                hasCanceled_ ? reject({isCanceled: true}) : reject(error)
            );
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled_ = true;
            },
        };
    };

    static formatTimestamp(timestamp, pattern='DD-MM-YYYY HH:mm') {
        return moment(timestamp, 'YYYY-MM-DD HH:mm:ss').format(pattern);
    }
}