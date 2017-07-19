/**
 * Created by jakubniezgoda on 2017-06-02.
 */

exports.command = function(selector) {
    return this
        .waitForElementVisible(selector)
        .click(selector, (result) => this.log('Clicked element', result.status === 0 ? 'successfully.' : 'with no success. error - '+result.value.message));
};