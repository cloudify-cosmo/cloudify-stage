/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName, blueprintYamlFile = 'blueprint.yaml') {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    var blueprintExists = false;

    this.isWidgetPresent(this.page.filter().props.widgetId, result => {
        this.log("adding", blueprintName, "blueprint - check if already presented");

        if (!result.value) {
            this.moveToEditMode()
                .addWidget(this.page.filter().props.widgetId)
                .moveOutOfEditMode();
        }

        this.page.filter()
            .isBlueprintPresent(blueprintName, result => {
                blueprintExists = result.value;
                this.log("adding", blueprintName, "blueprint - presented:", blueprintExists)
            })
    });

    return this.perform(() => {
        var blueprints = this.page.blueprints();

        if (!blueprintExists) {
            this.isWidgetPresent(blueprints.props.widgetId, result => {
                this.log("adding", blueprintName, "blueprint - upload blueprint");

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget(blueprints.props.widgetId)
                        .moveOutOfEditMode();
                }

                blueprints.clickElement('@uploadButton');

                let blueprintYamlFileOptionElement = `select[name="blueprintFileName"] option[value="${blueprintYamlFile}"]`;
                let blueprintYamlFileDropdownSelector = blueprints.section.uploadModal.elements.blueprintYamlFile.selector;
                blueprints.section.uploadModal
                    .waitForElementVisible('@okButton')
                    .setValue('@blueprintName', blueprintName)
                    .setValue('@blueprintFile', this.page.resources().props.blueprint(blueprintName))
                    .waitForElementPresent(blueprintYamlFileOptionElement)
                    .selectOptionInDropdown(blueprintYamlFileDropdownSelector, blueprintYamlFile)
                    .clickElement('@okButton');

                blueprints.waitForElementNotPresent('@uploadModal', 10000);

                this.page.filter()
                    .waitForBlueprintPresent(blueprintName);
            });
        }
    });
};