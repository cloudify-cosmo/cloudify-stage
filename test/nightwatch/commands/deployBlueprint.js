/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName, inputs, blueprintName) {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    this.isDeploymentExist(deploymentName, result => {
        if (!result.value) {
            const blueprintActionButtons = this.page.blueprintActionButtons();
            this.isWidgetPresent(blueprintActionButtons.props.widgetId, result => {
                this.log('deploying', blueprintName, 'blueprint');

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget(blueprintActionButtons.props.widgetId)
                        .moveOutOfEditMode();
                }

                this.selectBlueprint(blueprintName);

                blueprintActionButtons.section.buttons
                    .waitForElementNotPresent('@createButtonDisabled')
                    .waitForElementNotVisible('@widgetLoader')
                    .clickElement('@createDeploymentButton');

                const blueprints = this.page.blueprints();
                blueprints.section.deployBlueprintModal.fillIn(deploymentName, inputs).clickDeploy();
            });
        } else {
            this.log('not deploying', blueprintName, 'blueprint,', deploymentName, 'deployment already exists');
        }
    });
};
