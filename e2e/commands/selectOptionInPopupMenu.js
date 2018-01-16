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
            this.log(`Checking option '${text.value}'.`);
            if (text.value === optionName) {
                optionElementIdToClick = optionElementIds[index];
                this.log(`Found '${optionName}' option.`);
            } else {
                if (index < optionElementIds.length) {
                    index++;
                    findOptionElementId();
                } else {
                    this.log(`Option '${optionName}' not found.`);
                }
            }
        })
    };

    return this
        .log(`Opening popup menu '${popupMenuTriggerElement}'...`)
        .clickElement(popupMenuTriggerElement)
        .log(`Looking for option '${optionName}' inside '${OPTION_SELECTOR}'...`)
        .elements('css selector', OPTION_SELECTOR, function (elements) {
            for (let i = 0; i < elements.value.length; i++) {
                optionElementIds.push(elements.value[i].ELEMENT);
            }
            this.log(`Found ${optionElementIds.length} option(s).`);
        })
        .perform(findOptionElementId)
        .perform(() => this.elementIdClick(optionElementIdToClick, (result) => this.log('Clicked element', result.status === 0 ? 'successfully.' : 'with no success. error - '+result.value.message)))
    };