/**
 * Created by jakubniezgoda on 02/06/2017.
 */

const _ = require('lodash');

exports.command = function(dropdownTriggerElement, dropdownCssSelector, optionName) {
    const optionValue = _.isEmpty(optionName) ? 'empty-option' : optionName;
    const OPTION_SELECTOR = `${dropdownCssSelector} div[role="option"][option-value="${optionValue}"]`;

    return this.log(`Opening dropdown (Element: ${dropdownTriggerElement}, CSS: ${dropdownCssSelector})...`)
        .clickElement(dropdownTriggerElement)
        .useCss()
        .log(`Clicking option value: ${optionValue}...`)
        .clickElement(OPTION_SELECTOR)
        .getAttribute(dropdownCssSelector, 'class', function(result) {
            if (_.includes(_.words(result.value), 'multiple')) {
                this.clickElement(dropdownCssSelector);
            }
        });
};
