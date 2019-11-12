/**
 * Created by jakubniezgoda on 12/06/2017.
 */

const _ = require('lodash');

exports.command = function(popupMenuTriggerElement, optionName, additionalSelector = '') {
    const optionValue = _.isEmpty(optionName) ? 'empty-option' : optionName;
    const OPTION_SELECTOR = `div.popupMenu ${additionalSelector} a.item[option-value="${optionValue}"]`;

    return this.log(`Opening popup menu '${popupMenuTriggerElement}'...`)
        .clickElement(popupMenuTriggerElement)
        .useCss()
        .clickElement(OPTION_SELECTOR);
};
