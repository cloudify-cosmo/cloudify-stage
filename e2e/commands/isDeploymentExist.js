/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName, callback) {
    return this.isWidgetPresent(this.page.filter().props.widgetId, result => {
        if (!result.value) {
            this.moveToEditMode()
                .addWidget(this.page.filter().props.widgetId)
                .moveOutOfEditMode();
        }

        this.page.filter()
            .isDeploymentPresent(deploymentName, result => {
                this.log("does deployment", deploymentName, "exist:", result.value)

                if (callback) {
                    callback(result);
                }
            })
    });
};