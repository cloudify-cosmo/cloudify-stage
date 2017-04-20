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

    static formatTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern='YYYY-MM-DD HH:mm:ss') {
        return moment.utc(timestamp, inputPattern).local().format(outputPattern);
    }

    /**
     * Replace all occurrences of <Tag attr1="value1" attr1="value2" ...> to "tag value1 value2 ..."
     * @param message
     * @returns {*}
     */
    static resolveMessage(message) {
        var tagPattern = /<(\w+)[^<]*>/;
        var attrPattern = /\w+=[',",`](\w+)[',",`]/g;

        var matchedTag, matchedAttr, sentence = "";
        while (matchedTag = tagPattern.exec(message)) {
            var tag = matchedTag[0];
            var sentence = matchedTag[1].toLowerCase();

            while (matchedAttr = attrPattern.exec(tag)) {
                sentence += " " + matchedAttr[1];
            }

            message = message.replace(tag, sentence);
        }

        return message;
    }

}