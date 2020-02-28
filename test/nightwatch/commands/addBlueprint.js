/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName, blueprintUrl = '', blueprintYamlFile = '') {
    const api = this;

    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }
    if (!blueprintUrl) {
        blueprintUrl = this.page.blueprints().props.testBlueprintUrl;
    }

    if (!blueprintYamlFile) {
        blueprintYamlFile = this.page.blueprints().props.testBlueprintYamlFile;
    }

    return this.isBlueprintExist(blueprintName, result => {
        if (!result.value) {
            const blueprints = this.page.blueprints();

            this.isWidgetPresent(blueprints.props.widgetId, result => {
                this.log('adding', blueprintName, 'blueprint - upload blueprint');

                if (!result.value) {
                    this.moveToEditMode()
                        .addWidget(blueprints.props.widgetId)
                        .moveOutOfEditMode();
                }

                blueprints.clickElement('@uploadButton');

                const blueprintYamlFileOptionElement = `div[name="blueprintFileName"] div[option-value="${blueprintYamlFile}"]`;
                const blueprintYamlFileDropdownSelector =
                    blueprints.section.uploadModal.elements.blueprintYamlFile.selector;
                blueprints.section.uploadModal
                    .waitForElementVisible('@okButton')
                    .setElementValue('@blueprintUrl', [blueprintUrl, api.Keys.TAB])
                    .waitForElementNotPresent('@loading')
                    .resetValue('@blueprintName')
                    .setElementValue('@blueprintName', blueprintName)
                    .waitForElementPresent(blueprintYamlFileOptionElement)
                    .selectOptionInDropdown(
                        blueprintYamlFileDropdownSelector,
                        blueprintYamlFileDropdownSelector,
                        blueprintYamlFile
                    )
                    .clickElement('@okButton');

                blueprints.waitForElementNotPresent('@uploadModal');
            });
        } else {
            this.log('not adding', blueprintName, 'blueprint, it already exists');
        }
    });
};
