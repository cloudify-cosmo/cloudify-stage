/**
 * Created by pawelposel on 09/11/2016.
 */

export default class StageUtils {

    static createManagerUrl(managerIp, queryString) {
        let su = encodeURIComponent(`http://${managerIp}${queryString?queryString:''}`);
        return `http://${window.location.hostname}:8088/sp/?su=${su}`;
    }

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
}