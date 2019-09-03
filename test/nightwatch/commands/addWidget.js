/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(widgetId) {
    const page = this.page.page();

    return this.isWidgetPresent(widgetId, result => {
        if (!result.value) {
            this.log('adding', widgetId, 'widget');

            this.isPresent(page.section.addWidgetModal.selector, result => {
                if (!result.value) {
                    this.log('opening add widget modal');
                    page.section.editModeSidebar.clickElement('@addWidgetButton');
                }
                page.section.addWidgetModal
                    .waitForElementVisible(page.section.addWidgetModal.selector)
                    .selectAndAddWidget(widgetId);
            });
        }
    });
};
