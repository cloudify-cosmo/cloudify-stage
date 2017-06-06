/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName) {
    var deploymentActionButtons = this.page.deploymentActionButtons();

    return this.isWidgetPresent(deploymentActionButtons.props.widgetId, result => {
            console.log("-- removing " + deploymentName + " deployment");

            if (!result.value) {
                this.moveToEditMode()
                    .addWidget(deploymentActionButtons.props.widgetId)
                    .moveOutOfEditMode();
            }

            this.selectDeployment(deploymentName);

            deploymentActionButtons.section.buttons
                .waitForElementNotPresent('@deleteButtonDisabled')
                .click('@deleteDeploymentButton');

            deploymentActionButtons.section.removeConfirm
                .waitForElementVisible('@okButton')
                .click('@okButton')
                .waitForElementNotPresent('@okButton');

            this.page.filter()
                .waitForDeploymentNotPresent(deploymentName);
        });
};