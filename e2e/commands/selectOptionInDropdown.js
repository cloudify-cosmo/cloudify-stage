/**
 * Created by jakubniezgoda on 02/06/2017.
 */

var _ = require('lodash');

exports.command = function (dropdownTriggerElement, optionName) {
    const OPTION_SELECTOR = 'div.dropdownPortal div[role="option"]';

    let optionElementIdToClick = '';
    let optionElementIds = [];
    let index = 0;
    let findOptionElementId = () => {
        this.elementIdText(optionElementIds[index], (text) => {
            if (text.value === optionName) {
                optionElementIdToClick = optionElementIds[index];
                this.log('Found', optionName, 'option.');
            } else {
                if (index < optionElementIds.length) {
                    index++;
                    findOptionElementId();
                } else {
                    this.log('Option', optionName, 'not found.');
                }
            }
        })
    };

    return this
        .log(`Opening dropdown and looking for option: ${optionName}.`)
        .clickElement(dropdownTriggerElement)
        .elements('css selector', OPTION_SELECTOR, function (elements) {
            for (let i = 0; i < elements.value.length; i++) {
                optionElementIds.push(elements.value[i].ELEMENT);
            }
        })
        .perform(findOptionElementId)
        .perform(() => this.elementIdClick(optionElementIdToClick))
        .getAttribute(dropdownTriggerElement, 'class', function(result) {
            if (_.includes(_.words(result.value), 'multiple')) {
                this.clickElement(dropdownTriggerElement)
            };
        });
    };