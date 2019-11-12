/**
 * Created by jakubniezgoda on 06/06/2017.
 */

exports.command = function(field, checked) {
    const _ = require('lodash');
    let checkboxChecked = false;
    const checkboxWrapper = `${field} div.checkbox`;

    return this.getAttribute(
        checkboxWrapper,
        'class',
        result => (checkboxChecked = _.includes(result.value, 'checked'))
    ).perform(() => (checkboxChecked !== checked ? this.clickElement(checkboxWrapper) : null));
};
