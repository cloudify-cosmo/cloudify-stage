/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName, blueprintUrl = '', blueprintYamlFile = '') {
    let api = this;

    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }
    if (!blueprintUrl) {
        blueprintUrl = this.page.blueprints().props.testBlueprintUrl;
    }

    if(!blueprintYamlFile) {
        blueprintYamlFile = this.page.blueprints().props.testBlueprintYamlFile;
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

                let blueprintYamlFileOptionElement = `div[name="blueprintFileName"] div[option-value="${blueprintYamlFile}"]`;
                let blueprintYamlFileDropdownSelector = blueprints.section.uploadModal.elements.blueprintYamlFile.selector;
                blueprints.section.uploadModal
                    .waitForElementVisible('@okButton')
                    .setElementValue('@blueprintName', blueprintName)
                    .setElementValue('@blueprintUrl', [blueprintUrl, api.Keys.TAB])
                    .waitForElementPresent(blueprintYamlFileOptionElement)
                    .selectOptionInDropdown(blueprintYamlFileDropdownSelector, blueprintYamlFileDropdownSelector, blueprintYamlFile)
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
