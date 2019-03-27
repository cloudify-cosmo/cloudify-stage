/**
 * Created by jakubniezgoda on 06/06/2017.
 */

exports.command = function (field, checked) {
    let _ = require('lodash');
    let checkboxChecked = false;
    let checkboxWrapper = field + ' div.checkbox';

    return this
        .getAttribute(checkboxWrapper, 'class', (result) => checkboxChecked = _.includes(result.value, 'checked'))
        .perform(() => checkboxChecked !== checked ? this.clickElement(checkboxWrapper) : null);
    };