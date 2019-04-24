/**
 * Created by pawelposel on 2017-06-09.
 */

exports.command = function (selector) {
    return this.setValue(selector, [this.Keys.CONTROL, 'a', this.Keys.BACK_SPACE]);
};