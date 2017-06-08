/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName) {
    var deploymentActionButtons = this.page.deploymentActionButtons();

    return this.isWidgetPresent(deploymentActionButtons.props.widgetId, result => {
            this.log("removing", deploymentName, "deployment");

            if (!result.value) {
                this.moveToEditMode()
                    .addWidget(deploymentActionButtons.props.widgetId)
                    .moveOutOfEditMode();
            }

            this.selectDeployment(deploymentName);

            deploymentActionButtons.section.buttons
                .waitForElementNotPresent('@deleteButtonDisabled')
                .clickElement('@deleteDeploymentButton');

            deploymentActionButtons.section.removeConfirm
                .clickElement('@okButton')
                .waitForElementNotPresent('@okButton');

            this.page.filter()
                .waitForDeploymentNotPresent(deploymentName);
        });
};