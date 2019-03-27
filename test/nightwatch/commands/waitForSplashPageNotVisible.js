/**
 * Created by jakubniezgoda on 2017-10-10.
 */

exports.command = function() {
    return this.waitForElementNotVisible('div.splashPage');
};