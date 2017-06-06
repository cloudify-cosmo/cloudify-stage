/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName, inputs, blueprintName) {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    var blueprintActionButtons = this.page.blueprintActionButtons();

    return this.isWidgetPresent(blueprintActionButtons.props.widgetId, result => {
            console.log("-- deploying " + blueprintName + " blueprint");

            if (!result.value) {
                this.moveToEditMode()
                    .addWidget(blueprintActionButtons.props.widgetId)
                    .moveOutOfEditMode();
            }

            this.selectBlueprint(blueprintName);

            blueprintActionButtons.section.buttons
                .waitForElementNotPresent('@createButtonDisabled')
                .click('@createDeploymentButton');

            var deployments = this.page.deployments();

            deployments.section.deployModal
                .waitForElementVisible('@okButton')
                .setValue('@deploymentName', deploymentName)
                .setInputsValue(inputs)
                .click('@okButton');

            deployments.waitForElementNotPresent('@deployModal', 10000);

            this.page.filter()
                .waitForDeploymentPresent(deploymentName);
        });
};