/**
 * Created by kinneretzin on 27/03/2017.
 */

var pathlib = require('path');

var WidgetsHandler = require('./WidgetsHandler');

module.exports =  {
    addBlueprint : function(client, name) {
        if (!name) {
            name = client.page.blueprints().props.testBlueprint;
        }

        var blueprintExists = false;

        var page = client.page.page().section.page;
        page.isWidgetPresent("filter", result => {
            console.log("-- adding " + name + " blueprint - check if already presented");

            if (!result.value) {
                WidgetsHandler.moveToEditMode(client);
                WidgetsHandler.addWidget(client, "filter");
                WidgetsHandler.moveOutOfEditMode(client);
            }

            var filterWidget = client.page.filter();
            filterWidget.isBlueprintPresent(name, result => {
                blueprintExists = result.value;
                console.log("-- adding " + name + " blueprint - presented: " + blueprintExists)
            })
        });

        client.perform(() => {
           if (!blueprintExists) {
               page.isWidgetPresent("blueprints", result => {
                   console.log("-- adding " + name + " blueprint - upload blueprint");

                   if (!result.value) {
                       WidgetsHandler.moveToEditMode(client);
                       WidgetsHandler.addWidget(client, "blueprints");
                       WidgetsHandler.moveOutOfEditMode(client);
                   }

                   var blueprintsWidget = client.page.blueprints();

                   blueprintsWidget.waitForElementVisible('@uploadButton', 2000).click('@uploadButton');
                   blueprintsWidget.section.uploadModal
                       .waitForElementVisible('@okButton', 2000)
                       .setValue('@blueprintName', name)
                       .setValue('@blueprintFile', pathlib.resolve('e2e/resources/' + name + '.zip'))
                       .click('@okButton');

                   blueprintsWidget.waitForElementNotPresent('@uploadModal', 10000);

                   var filterWidget = client.page.filter();
                   filterWidget.waitForBlueprintPresent(name);
               });
           }
        });
    },

    selectBlueprint : function(client, name) {
        if (!name) {
            name = client.page.blueprints().props.testBlueprint;
        }

        var page = client.page.page().section.page;

        page.isWidgetPresent("filter", result => {
            console.log("-- selecting " + name + " blueprint")

            if (!result.value) {
                WidgetsHandler.moveToEditMode(client);
                WidgetsHandler.addWidget(client, "filter");
                WidgetsHandler.moveOutOfEditMode(client);
            }

            var filterWidget = client.page.filter();
            filterWidget.setValue('@blueprintSearch', [name, client.Keys.ENTER]);
        });
    },

    removeBlueprint : function(client, name) {
        if (!name) {
            name = client.page.blueprints().props.testBlueprint;
        }

        var page = client.page.page().section.page;

        page.isWidgetPresent("blueprintActionButtons", result => {
            console.log("-- removing " + name + " blueprint")

            if (!result.value) {
                WidgetsHandler.moveToEditMode(client);
                WidgetsHandler.addWidget(client, "blueprintActionButtons");
                WidgetsHandler.moveOutOfEditMode(client);
            }

            this.selectBlueprint(client, name);

            var blueprintActionButtonsWidget = client.page.blueprintActionButtons();
            blueprintActionButtonsWidget.section.buttons
                .waitForElementNotPresent('@deleteButtonDisabled')
                .click('@deleteBlueprintButton');

            blueprintActionButtonsWidget.section.removeConfirm
                .waitForElementVisible('@okButton')
                .click('@okButton')
                .waitForElementNotPresent('@okButton');

            var filterWidget = client.page.filter();
            filterWidget.waitForBlueprintNotPresent(name);
        });
    }

};