/**
 * Created by pawelposel on 2017-05-31.
 */

var pathlib = require("path");

exports.command = function(blueprintName) {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    var blueprintExists = false;

    this.isWidgetPresent(this.page.filter().props.widgetId, result => {
        console.log("-- adding " + blueprintName + " blueprint - check if already presented");

        if (!result.value) {
            this.moveToEditMode()
                .addWidget(this.page.filter().props.widgetId)
                .moveOutOfEditMode();
        }

        this.page.filter()
            .isBlueprintPresent(blueprintName, result => {
                blueprintExists = result.value;
                console.log("-- adding " + blueprintName + " blueprint - presented: " + blueprintExists)
            })
    });

    return this.perform(() => {
        var blueprints = this.page.blueprints();

        if (!blueprintExists) {
            this.isWidgetPresent(blueprints.props.widgetId, result => {
                console.log("-- adding " + blueprintName + " blueprint - upload blueprint");

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget(blueprints.props.widgetId)
                        .moveOutOfEditMode();
                }

                blueprints.waitForElementVisible('@uploadButton')
                    .click('@uploadButton');

                blueprints.section.uploadModal
                    .waitForElementVisible('@okButton')
                    .setValue('@blueprintName', blueprintName)
                    .setValue('@blueprintFile', pathlib.resolve('e2e/resources/' + blueprintName + '.zip'))
                    .click('@okButton');

                blueprints.waitForElementNotPresent('@uploadModal', 10000);

                this.page.filter()
                    .waitForBlueprintPresent(blueprintName);
            });
        }
    });
};