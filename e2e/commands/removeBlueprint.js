/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(name) {
    if (!name) {
        name = this.page.blueprints().props.testBlueprint;
    }

    return this.page.page()
        .section.page
        .isWidgetPresent("blueprintActionButtons", result => {
            console.log("-- removing " + name + " blueprint");

            if (!result.value) {
                this.moveToEditMode()
                    .addWidget("blueprintActionButtons")
                    .moveOutOfEditMode();
            }

            this.selectBlueprint(name);

            var blueprintActionButtonsWidget = this.page.blueprintActionButtons();
            blueprintActionButtonsWidget
                .section.buttons
                .waitForElementNotPresent('@deleteButtonDisabled')
                .click('@deleteBlueprintButton');

            blueprintActionButtonsWidget
                .section.removeConfirm
                .waitForElementVisible('@okButton')
                .click('@okButton')
                .waitForElementNotPresent('@okButton');

            this.page.filter()
                .waitForBlueprintNotPresent(name);
        });
};