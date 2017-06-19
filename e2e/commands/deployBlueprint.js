/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName, inputs, blueprintName) {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    var deploymentExists = false;

    this.isWidgetPresent(this.page.filter().props.widgetId, result => {
        this.log("deploying", deploymentName, "from", blueprintName, "blueprint - check if already presented");

        if (!result.value) {
            this.moveToEditMode()
                .addWidget(this.page.filter().props.widgetId)
                .moveOutOfEditMode();
        }

        this.page.filter()
            .isDeploymentPresent(deploymentName, result => {
                deploymentExists = result.value;
                this.log("deploying", deploymentName, "from", blueprintName, "blueprint - presented:", deploymentExists)
            })
    });
    return this.perform(() => {
        if (!deploymentExists) {
            var blueprintActionButtons = this.page.blueprintActionButtons();
            this.isWidgetPresent(blueprintActionButtons.props.widgetId, result => {
                this.log("deploying", blueprintName, "blueprint");

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

                var blueprints = this.page.blueprints();
                inputs['deploymentName'] = deploymentName;
                blueprints.section.deployBlueprintModal
                    .fillIn(inputs)
                    .clickDeploy();

                this.page.filter()
                    .waitForDeploymentPresent(deploymentName);
            });
        } else {
            this.log("not deploying", blueprintName, "blueprint,", deploymentName, "deployment already exists");
        }
    });
};