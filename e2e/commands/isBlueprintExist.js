/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName, callback) {
    return this.isWidgetPresent(this.page.filter().props.widgetId, result => {
        if (!result.value) {
            this.moveToEditMode()
                .addWidget(this.page.filter().props.widgetId)
                .moveOutOfEditMode();
        }

        this.page.filter()
            .isBlueprintPresent(blueprintName, result => {
                this.log("does blueprint", blueprintName, "exist:", result.value)

                if (callback) {
                    callback(result);
                }
            })
    });
};