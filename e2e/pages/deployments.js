/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    elements: {
        header: 'div.deploymentsWidget h5.header',
        loader: 'div.deploymentsWidget div.widgetLoader',
        editWidgetButton: 'div.deploymentsWidget .widgetEditButtons i.editWidgetIcon',
        removeWidgetButton: 'div.deploymentsWidget .widgetEditButtons i.remove',
        expandWidgetButton: 'div.deploymentsWidget .widgetViewButtons i.expand'
    },

    props: {
        widgetId: 'deployments'
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
    ],

    sections: {
        deploymentsTable: {
            selector: 'div.deploymentsWidget table.deploymentsTable',
            elements: {

            },
            props: {
                deploymentRow : (name) => `tr#deploymentsTable_${name}`,
                deploymentMenu : (name) => `tr#deploymentsTable_${name} td.rowActions i.menuAction`,
                workflowExecutionLabel : (name) => `tr#deploymentsTable_${name} td.rowActions div.label`,
                editOption: 'Edit',
                deleteOption: 'Delete',
                forceDeleteOption: 'Force Delete'
            },
            commands: [
                {
                    clickRow: function (deploymentId) {
                        return this.clickElement(this.props.deploymentRow(deploymentId));
                    },

                    clickExecuteWorkflow: function (deploymentId, workflowId) {
                        return this.selectOptionInPopupMenu(this.props.deploymentMenu(deploymentId), workflowId);
                    },

                    clickEdit: function (deploymentId) {
                        return this.selectOptionInPopupMenu(this.props.deploymentMenu(deploymentId), this.props.editOption);
                    },

                    clickDelete: function (deploymentId) {
                        return this.selectOptionInPopupMenu(this.props.deploymentMenu(deploymentId), this.props.deleteOption);
                    },

                    clickForceDelete: function (deploymentId) {
                        return this.selectOptionInPopupMenu(this.props.deploymentMenu(deploymentId), this.props.forceDeleteOption);
                    },

                    checkIfDeploymentPresent: function (deploymentId) {
                        return this.waitForElementPresent(this.props.deploymentRow(deploymentId), (result) => {
                            this.assert.equal(result.status, 0, 'Deployment ' + deploymentId + ' present.');
                        });
                    },

                    checkIfDeploymentRemoved: function (deploymentId) {
                        return this.waitForElementNotPresent(this.props.deploymentRow(deploymentId), (result) => {
                            this.assert.equal(result.status, 0, 'Deployment ' + deploymentId + ' removed.');
                        });
                    },

                    checkIfWorkflowStartedOnDeployment: function(deploymentId, timeout) {
                        return this.waitForElementPresent(this.props.workflowExecutionLabel(deploymentId), timeout, (result) => {
                            this.assert.equal(result.status, 0, 'Workflow execution on ' + deploymentId + ' in progress.');
                        });
                    },

                    checkIfWorkflowFinishedOnDeployment: function(deploymentId, timeout) {
                        return this.waitForElementNotPresent(this.props.workflowExecutionLabel(deploymentId), timeout, (result) => {
                            this.assert.equal(result.status, 0, 'Workflow execution on ' + deploymentId + ' finished.');
                        });
                    }
                }
            ]
        },

        deploymentsList: {
            selector: 'div.deploymentsWidget .segmentList',
            props: {
                deploymentElementSelector : (name) => `div.segmentList div.${name} h3`
            },
            commands: [
                {
                    clickSegment: function (deploymentId) {
                        return this.clickElement(this.props.deploymentElementSelector(deploymentId));
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
                listView: 'List',
            },
            commands: [
                {
                    setDrilldown: function(value) {
                        return this.setCheckbox('.content div.field.clickToDrillDown', value);
                    },
                    setPollingTime: function(value) {
                        return this.setInputText('.content div.field.pollingTime', value);
                    },
                    setBlueprintIdFilter: function(blueprintId) {
                        return this.setInputText('.content div.field.blueprintIdFilter', blueprintId);
                    },
                    setTableView: function () {
                        return this.selectOptionInDropdown('@displayStyle', this.props.tableView);
                    },
                    setListView: function () {
                        return this.selectOptionInDropdown('@displayStyle', this.props.listView);

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
                    }
                }
            ],
        },

        updateDeploymentModal: {
            selector: '.updateDeploymentModal',
            elements: {
                blueprintFile: '.content input[name="blueprintFile"]',
                blueprintUrl: '.content input[name="blueprintUrl"]',
                blueprintInputsFile: '.content input[name="inputsFile"]',
                blueprintYamlFile: '.content input[name="applicationFileName-search"]',
                updateButton: '.actions button.button.ok',
                cancelButton: '.actions button.button.cancel'
            },
            commands: [
                {
                    fillIn: function(blueprintUrl, blueprintYamlFile = 'blueprint.yaml') {
                        let blueprintFileOptionElement = `select[name="applicationFileName"] option[value="${blueprintYamlFile}"]`;
                        // var pathlib = require("path");
                        return this
                            .waitForElementVisible(this.selector)
                            .setValue('@blueprintUrl', [blueprintUrl, this.api.Keys.TAB])
                            // TODO: Make inputs.yaml file accessible from the server
                            // .setValue('@blueprintInputsFile', pathlib.resolve('e2e/resources/' + blueprintName + 'Inputs.yaml'))
                            .waitForElementPresent(blueprintFileOptionElement)
                            .selectOptionInDropdown(this.elements.blueprintYamlFile.selector, blueprintYamlFile);
                    },
                    clickUpdate: function () {
                        this.waitForElementVisible(this.selector)
                            .clickElement('@updateButton')
                            .waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },

        executeWorkflowModal: {
            selector: '.executeWorkflowModal',
            elements: {
                executeButton: '.actions button.button.ok',
                cancelButton: '.actions button.button.cancel'
            },
            commands: [
                {
                    clickExecute: function () {
                        this.waitForElementVisible(this.selector)
                            .clickElement('@executeButton')
                            .waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },

        removeDeploymentModal: {
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
    }
};
