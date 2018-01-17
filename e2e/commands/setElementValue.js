/**
 * Created by jakubniezgoda on 2018-01-17.
 */

exports.command = function(selector, value) {
    return this
        .waitForElementPresent(selector)
        .log(`Setting value '${value}' on '${selector}'.`)
        .setValue(selector, value, (result) => this.assert.equal(result.status, 0, 'Value set.'));
};