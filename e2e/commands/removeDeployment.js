/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName) {
    return this.isDeploymentExist(deploymentName, result => {
        if (result.value) {
            var deploymentActionButtons = this.page.deploymentActionButtons();

            this.isWidgetPresent(deploymentActionButtons.props.widgetId, result => {
                this.log("removing", deploymentName, "deployment");

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget(deploymentActionButtons.props.widgetId)
                        .moveOutOfEditMode();
                }

                this.selectDeployment(deploymentName);

                deploymentActionButtons.section.buttons
                    .waitForElementNotPresent('@deleteButtonDisabled')
                    .waitForElementNotVisible('@widgetLoader')
                    .clickElement('@deleteDeploymentButton');

                deploymentActionButtons.section.removeConfirm
                    .clickElement('@okButton')
                    .waitForElementNotPresent('@okButton');

                this.page.filter()
                    .waitForDeploymentNotPresent(deploymentName)
                    .selectOptionInDropdown('@deploymentSearch', "");
            });
        } else {
            this.log("not removing", deploymentName, "deployment, it doesn't exist");
        }
    });
};