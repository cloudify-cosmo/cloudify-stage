/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(widgetId) {
    var page = this.page.page();

    return this.isWidgetPresent(widgetId, result => {
        if (!result.value) {
            console.log("-- adding " + widgetId + " widget");

            page.section.page
                .click('@addWidgetButton');

            this.pause(1000); // Wait for modal to open

            page.section.addWidgetModal
                .clickAddWidget(widgetId);
        }
    });
};