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
                blueprintYamlFile: '.content input[name="blueprintFileName-search"]',
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
                            .setValue('@blueprintUrl', [blueprintUrl, this.api.Keys.TAB], (result) => this.log('setValueBlueprintUrl=',result))
                            .setValue('@blueprintName', blueprintName, (result) => this.log('setValueBlueprintName=',result))
                            .waitForElementPresent(blueprintFileOptionElement, 20000)
                            .selectOptionInDropdown(this.elements.blueprintYamlFile.selector, blueprintYamlFile);

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
                                    this.setValue(`input[name="${inputName}"]`, inputValue)
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
                        return this.selectOptionInDropdown('@displayStyle', this.props.tableView);
                    },
                    setCatalogView: function () {
                        return this.selectOptionInDropdown('@displayStyle', this.props.catalogView);

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
        header: 'div.blueprintsWidget h5.header',
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
        testBlueprintUrl: 'https://github.com/cloudify-cosmo/cloudify-hello-world-example/archive/master.zip'
    },

    commands: [
        {
            configureWidget: function () {
                this.moveToEditMode()
                    .waitForElementPresent('@header')
                    .waitForElementNotVisible('@loader', 20000)
                    .moveToElement('@header', 5, 5)
                    .clickElement('@editWidgetButton')
                return this;
            },
        }
    ]
};
