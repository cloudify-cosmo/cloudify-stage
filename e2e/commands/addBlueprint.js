/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName, blueprintUrl = '', blueprintYamlFile = 'blueprint.yaml') {
    let api = this;

    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }
    if (!blueprintUrl) {
        blueprintUrl = this.page.blueprints().props.testBlueprintUrl;
    }

    return this.isBlueprintExist(blueprintName, result => {
        if (!result.value) {
            var blueprints = this.page.blueprints();

            this.isWidgetPresent(blueprints.props.widgetId, result => {
                this.log('adding', blueprintName, 'blueprint - upload blueprint');

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
                    .setValue('@blueprintUrl', [blueprintUrl, api.Keys.TAB])
                    .waitForElementPresent(blueprintYamlFileOptionElement, 20000)
                    .selectOptionInDropdown(blueprintYamlFileDropdownSelector, blueprintYamlFile)
                    .clickElement('@okButton');

                blueprints.waitForElementNotPresent('@uploadModal');

                this.page.filter()
                    .waitForBlueprintPresent(blueprintName);
            });
        } else {
            this.log('not adding', blueprintName, 'blueprint, it already exists');
        }
    });
};