/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(widgetId) {
    return this.moveToEditMode()
        .addPage()
        .addWidget(widgetId)
        .moveOutOfEditMode();
};
