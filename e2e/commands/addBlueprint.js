/**
 * Created by pawelposel on 2017-05-31.
 */

var pathlib = require("path");

exports.command = function(name) {
    if (!name) {
        name = this.page.blueprints().props.testBlueprint;
    }

    var blueprintExists = false;

    var page = this.page.page().section.page;
    page.isWidgetPresent("filter", result => {
        console.log("-- adding " + name + " blueprint - check if already presented");

        if (!result.value) {
            this.moveToEditMode()
                .addWidget("filter")
                .moveOutOfEditMode();
        }

        this.page.filter()
            .isBlueprintPresent(name, result => {
                blueprintExists = result.value;
                console.log("-- adding " + name + " blueprint - presented: " + blueprintExists)
            })
    });

    return this.perform(() => {
        if (!blueprintExists) {
            page.isWidgetPresent("blueprints", result => {
                console.log("-- adding " + name + " blueprint - upload blueprint");

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget("blueprints")
                        .moveOutOfEditMode();
                }

                var blueprintsWidget = this.page.blueprints();

                blueprintsWidget.waitForElementVisible('@uploadButton')
                    .click('@uploadButton');

                blueprintsWidget.section.uploadModal
                    .waitForElementVisible('@okButton')
                    .setValue('@blueprintName', name)
                    .setValue('@blueprintFile', pathlib.resolve('e2e/resources/' + name + '.zip'))
                    .click('@okButton');

                blueprintsWidget.waitForElementNotPresent('@uploadModal', 10000);

                this.page.filter()
                    .waitForBlueprintPresent(name);
            });
        }
    });
};