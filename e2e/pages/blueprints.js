/**
 * Created by kinneretzin on 25/12/2016.
 */


module.exports = {
    sections: {
        blueprintsTable: {
            selector: 'div.blueprintsWidget table.blueprintsTable',
            elements: {

            },
            props: {
                blueprintRow : (name) => `tr#blueprintsTable_${name}`,
                createDeploymentButton : (name) => `tr#blueprintsTable_${name} td.rowActions i.rocket`,
                deploymentsCount : (name) => `tr#blueprintsTable_${name} td div.ui.green.horizontal.label`
            },
            commands: [
                {
                    clickRow: function (blueprintName) {
                        return this.clickElement(this.props.blueprintRow(blueprintName));
                    },

                    clickDeploy: function (blueprintName) {
                        return this.clickElement(this.props.createDeploymentButton(blueprintName));
                    },

                    clickRemove: function (blueprintName) {
                        let removeBlueprintButton = `${this.props.blueprintRow(blueprintName)} td.rowActions i.trash`;
                        return this.clickElement(removeBlueprintButton);
                    },

                    checkIfBlueprintPresent: function (blueprintName) {
                        return this.waitForElementPresent(this.props.blueprintRow(blueprintName), (result) => {
                            this.assert.equal(result.status, 0, 'Blueprint ' + blueprintName + ' present.');
                        });
                    },

                    checkIfBlueprintRemoved: function (blueprintName) {
                        return this.waitForElementNotPresent(this.props.blueprintRow(blueprintName), (result) => {
                            this.assert.equal(result.status, 0, 'Blueprint ' + blueprintName + ' removed.');
                        });
                    },

                    checkIfDeploymentsCountEqual: function (blueprintName, deploymentsCount) {
                        return this.getText(this.props.deploymentsCount(blueprintName), (result) => {
                            this.assert.equal(result.value, deploymentsCount, 'Deployments count equals to ' + deploymentsCount + '.');
                        });
                    },
                }
            ],
        },

        blueprintsCatalog: {
            selector: 'div.blueprintsWidget .segmentList',
            props: {
                blueprintElementSelector : (name) => `div.${name}`
            },
            commands: [
                {
                    clickSegment: function (blueprintName) {
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
                errorMessage: 'ui error message'
            },
            commands: [
                {
                    fillIn: function(blueprintUrl, blueprintName, blueprintYamlFile = 'blueprint.yaml') {
                        let blueprintFileOptionElement = `select[name="blueprintFileName"] option[value="${blueprintYamlFile}"]`;
                        return this
                            .waitForElementVisible(this.selector)
                            .setElementValue('@blueprintUrl', [blueprintUrl, this.api.Keys.TAB])
                            .setElementValue('@blueprintName', blueprintName)
                            .waitForElementPresent(blueprintFileOptionElement)
                            .selectOptionInDropdown('@blueprintYamlFile',
                                                    `${this.selector} ${this.elements.blueprintYamlFile.selector}`,
                                                    blueprintYamlFile);

                    },
                    clickUpload: function() {
                        return this
                            .clickElement('@okButton')
                            .waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },

        deployBlueprintModal: {
            selector: '.deployBlueprintModal',
            elements: {
                privateResource: '.header i[title="Private resource"]',
                deploymentName: '.content input[name="deploymentName"]',
                deployButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            commands: [
                {
                    fillIn: function(blueprintInputs) {
                        let _ = require('lodash');
                        this.waitForElementVisible('@deploymentName')
                            .api.perform(() =>
                                _.each(blueprintInputs, (inputValue, inputName) => {
                                    this.setElementValue(`input[name="${inputName}"]`, inputValue)
                                }));
                        return this;
                    },
                    setSkipValidation: function(value) {
                        return this.setCheckbox('.content .field.skipPluginsValidationCheckbox', value);
                    },
                    clickDeploy: function() {
                        return this
                            .clickElement('@deployButton')
                            .waitForElementNotPresent(this.selector);
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
                    clickYes: function () {
                        this.waitForElementVisible(this.selector)
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
                tableView: 'Table',
                catalogView: 'Catalog',
            },
            commands: [
                {
                    setDrilldown: function(value) {
                        return this.setCheckbox('.content div.field.clickToDrillDown', value);
                    },
                    setPollingTime: function(value) {
                        return this.setInputText('.content div.field.pollingTime', value);
                    },
                    setTableView: function () {
                        return this.selectOptionInDropdown('@displayStyle',
                                                           `${this.selector} ${this.elements.displayStyle.selector}`,
                                                           this.props.tableView);
                    },
                    setCatalogView: function () {
                        return this.selectOptionInDropdown('@displayStyle',
                                                           `${this.selector} ${this.elements.displayStyle.selector}`,
                                                           this.props.catalogView);

                    },
                    clickSave: function () {
                        return this
                            .clickElement('@saveButton')
                            .waitForElementNotPresent(this.selector);
                    },
                    clickCancel: function () {
                        return this
                            .clickElement('@cancelButton')
                            .waitForElementNotPresent(this.selector);
                    },
                    pause: function (value) {
                        this.api.pause(value);
                        return this;
                    }
                }
            ],
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
            configureWidget: function () {
                this.moveToEditMode()
                    .waitForElementPresent('@header')
                    .waitForElementNotVisible('@loader')
                    .waitForElementPresent('@header')
                    .moveToElement('@header', undefined, undefined) // For details, see: https://github.com/nightwatchjs/nightwatch/issues/1250#issuecomment-257644295
                    .clickElement('@editWidgetButton')
                return this;
            },
        }
    ]
};
