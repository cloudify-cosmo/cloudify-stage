/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    sections: {
        blueprintsTable: {
            selector: 'div.blueprintsWidget table.blueprintsTable',
            elements: {},
            props: {
                blueprintRow: name => `tr#blueprintsTable_${name}`,
                createDeploymentButton: name => `tr#blueprintsTable_${name} td.rowActions i.rocket`,
                deploymentsCount: name => `tr#blueprintsTable_${name} td div.ui.green.horizontal.label`
            },
            commands: [
                {
                    clickRow(blueprintName) {
                        return this.clickElement(this.props.blueprintRow(blueprintName));
                    },

                    clickDeploy(blueprintName) {
                        return this.clickElement(this.props.createDeploymentButton(blueprintName));
                    },

                    clickRemove(blueprintName) {
                        const removeBlueprintButton = `${this.props.blueprintRow(blueprintName)} td.rowActions i.trash`;
                        return this.clickElement(removeBlueprintButton);
                    },

                    checkIfBlueprintPresent(blueprintName) {
                        return this.waitForElementPresent(this.props.blueprintRow(blueprintName), result => {
                            this.assert.equal(result.status, 0, `Blueprint ${blueprintName} present.`);
                        });
                    },

                    checkIfBlueprintRemoved(blueprintName) {
                        return this.waitForElementNotPresent(this.props.blueprintRow(blueprintName), result => {
                            this.assert.equal(result.status, 0, `Blueprint ${blueprintName} removed.`);
                        });
                    },

                    checkIfDeploymentsCountEqual(blueprintName, deploymentsCount) {
                        return this.waitForElementVisible(this.props.deploymentsCount(blueprintName)).getText(
                            this.props.deploymentsCount(blueprintName),
                            result => {
                                this.assert.equal(
                                    result.value,
                                    deploymentsCount,
                                    `Deployments count equals to ${deploymentsCount}.`
                                );
                            }
                        );
                    }
                }
            ]
        },

        blueprintsCatalog: {
            selector: 'div.blueprintsWidget .segmentList',
            props: {
                blueprintElementSelector: name => `div.${name}`
            },
            commands: [
                {
                    clickSegment(blueprintName) {
                        return this.clickElement(this.props.blueprintElementSelector(blueprintName));
                    }
                }
            ]
        },

        uploadModal: {
            selector: '.uploadBlueprintModal',
            elements: {
                privateResourceLock: '.header i[title="Private resource"]',
                blueprintUrl: '.content input[name="blueprintUrl"]',
                blueprintName: '.content input[name="blueprintName"]',
                blueprintFile: '.content input[name="blueprintFile"]',
                blueprintYamlFile: '.content div.dropdown',
                imageUrl: '.content input[name="imageUrl"]',
                imageFile: '.content input[name="fileNameimageFile"]',
                okButton: '.actions button.ok',
                cancelButton: '.actions button.cancel',
                errorMessage: 'ui error message',
                loading: 'form.loading'
            },
            commands: [
                {
                    fillIn(blueprintUrl, blueprintName, blueprintYamlFile = 'blueprint.yaml') {
                        const blueprintFileOptionElement = `div[name="blueprintFileName"] div[option-value="${blueprintYamlFile}"]`;
                        return this.waitForElementVisible(this.selector)
                            .setElementValue('@blueprintUrl', [blueprintUrl, this.api.Keys.TAB])
                            .waitForElementNotPresent('@loading')
                            .resetValue('@blueprintName')
                            .setElementValue('@blueprintName', blueprintName)
                            .waitForElementPresent(blueprintFileOptionElement)
                            .selectOptionInDropdown(
                                '@blueprintYamlFile',
                                `${this.selector} ${this.elements.blueprintYamlFile.selector}`,
                                blueprintYamlFile
                            );
                    },
                    fillInForSingleYaml(blueprintSingleYamlFile, blueprintName) {
                        return this.waitForElementVisible(this.selector)
                            .setElementValue('@blueprintFile', blueprintSingleYamlFile)
                            .waitForElementNotPresent('@loading')
                            .resetValue('@blueprintName')
                            .setElementValue('@blueprintName', blueprintName);
                    },
                    clickUpload() {
                        return this.clickElement('@okButton').waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },

        deployBlueprintModal: {
            selector: '.deployBlueprintModal',
            elements: {
                privateResource: '.header i[title="Private resource"]',
                deploymentName: '.content input[name="deploymentName"]',
                deployButton: '.actions button:nth-child(2)',
                cancelButton: '.actions button.cancel'
            },
            commands: [
                {
                    fillIn(deploymentName, blueprintInputs) {
                        const _ = require('lodash');
                        this.waitForElementVisible('@deploymentName')
                            .setElementValue('@deploymentName', deploymentName)
                            .api.perform(() =>
                                _.each(blueprintInputs, (inputObject, inputName) =>
                                    this.setElementValue(
                                        `${inputObject.type === 'string' ? 'input' : 'textarea'}[name="${inputName}"]`,
                                        inputObject.value
                                    )
                                )
                            );
                        return this;
                    },
                    setSkipValidation(value) {
                        return this.setCheckbox('.content .field.skipPluginsValidationCheckbox', value);
                    },
                    clickDeploy() {
                        return this.clickElement('@deployButton').waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },

        removeBlueprintModal: {
            selector: '.confirmModal',
            elements: {
                yesButton: '.actions button.primary.button',
                noButton: '.actions button.button'
            },
            commands: [
                {
                    clickYes() {
                        return this.waitForElementVisible(this.selector)
                            .clickElement('@yesButton')
                            .waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },

        configureWidgetModal: {
            selector: '.editWidgetModal',
            elements: {
                displayStyle: '.content div.field.displayStyle div[role="listbox"]',
                saveButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            props: {
                tableView: 'table',
                catalogView: 'catalog'
            },
            commands: [
                {
                    setDrilldown(value) {
                        return this.setCheckbox('.content div.field.clickToDrillDown', value);
                    },
                    setPollingTime(value) {
                        return this.setInputText('.content div.field.pollingTime', value);
                    },
                    setTableView() {
                        return this.selectOptionInDropdown(
                            '@displayStyle',
                            `${this.selector} ${this.elements.displayStyle.selector}`,
                            this.props.tableView
                        );
                    },
                    setCatalogView() {
                        return this.selectOptionInDropdown(
                            '@displayStyle',
                            `${this.selector} ${this.elements.displayStyle.selector}`,
                            this.props.catalogView
                        );
                    },
                    clickSave() {
                        return this.clickElement('@saveButton').waitForElementNotPresent(this.selector);
                    },
                    clickCancel() {
                        return this.clickElement('@cancelButton').waitForElementNotPresent(this.selector);
                    },
                    pause(value) {
                        this.api.pause(value);
                        return this;
                    }
                }
            ]
        }
    },
    elements: {
        header: 'div.blueprintsWidget > div.widgetItem > h5.header',
        loader: 'div.blueprintsWidget div.widgetLoader',
        uploadButton: 'div.blueprintsWidget .uploadBlueprintButton',
        uploadModal: '.uploadBlueprintModal',
        editWidgetButton: 'div.blueprintsWidget .widgetEditButtons i.editWidgetIcon',
        removeWidgetButton: 'div.blueprintsWidget .widgetEditButtons i.remove',
        expandWidgetButton: 'div.blueprintsWidget .widgetViewButtons i.expand'
    },
    props: {
        widgetId: 'blueprints',
        testBlueprint: 'blueprint',
        testBlueprintUrl: 'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.zip',
        testBlueprintYamlFile: 'local-blueprint.yaml'
    },

    commands: [
        {
            configureWidget() {
                this.moveToEditMode()
                    .waitForElementPresent('@header')
                    .waitForElementNotVisible('@loader')
                    .waitForElementPresent('@header')
                    .moveToElement('@header', undefined, undefined) // For details, see: https://github.com/nightwatchjs/nightwatch/issues/1250#issuecomment-257644295
                    .clickElement('@editWidgetButton');
                return this;
            }
        }
    ]
};
