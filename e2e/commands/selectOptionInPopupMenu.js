/**
 * Created by jakubniezgoda on 12/06/2017.
 */

exports.command = function (popupMenuTriggerElement, optionName) {
    const OPTION_SELECTOR = 'div.popupMenu a.item';

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
        .log(`Opening popup menu and looking for option: ${optionName}.`)
        .clickElement(popupMenuTriggerElement)
        .elements('css selector', OPTION_SELECTOR, function (elements) {
            for (let i = 0; i < elements.value.length; i++) {
                optionElementIds.push(elements.value[i].ELEMENT);
            }
        })
        .perform(findOptionElementId)
        .perform(() => this.elementIdClick(optionElementIdToClick))
    };