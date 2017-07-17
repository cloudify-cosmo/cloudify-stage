/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName) {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    return this.isBlueprintExist(blueprintName, result => {
        if (result.value) {
            var blueprintActionButtons = this.page.blueprintActionButtons();

            this.isWidgetPresent(blueprintActionButtons.props.widgetId, result => {
                this.log("removing", blueprintName, "blueprint");

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget(blueprintActionButtons.props.widgetId)
                        .moveOutOfEditMode();
                }

                this.selectBlueprint(blueprintName);

                blueprintActionButtons.section.buttons
                    .waitForElementNotPresent('@deleteButtonDisabled')
                    .clickElement('@deleteBlueprintButton');

                blueprintActionButtons.section.removeConfirm
                    .clickElement('@okButton')
                    .waitForElementNotPresent('@okButton');

                this.page.filter()
                    .waitForBlueprintNotPresent(blueprintName);
            });
        } else {
            this.log("not removing", blueprintName, "blueprint, it doesn't exist");
        }
    });
};