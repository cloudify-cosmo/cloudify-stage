/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    elements: {
        header: 'div.deploymentsWidget > div.widgetItem > h5.header',
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
                    .waitForElementNotVisible('@loader')
                    .waitForElementPresent('@header')
                    .moveToElement('@header', undefined, undefined) // For details, see: https://github.com/nightwatchjs/nightwatch/issues/1250#issuecomment-257644295
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
                executionInProgressIcon : (name) => `tr#deploymentsTable_${name} i.spinner.loading.icon`,
                updateOption: 'update',
                deleteOption: 'delete',
                forceDeleteOption: 'forceDelete'
            },
            commands: [
                {
                    clickRow: function (deploymentId) {
                        return this.clickElement(this.props.deploymentRow(deploymentId));
                    },

                    clickExecuteWorkflow: function (deploymentId, workflowId) {
                        return this.selectOptionInPopupMenu(this.props.deploymentMenu(deploymentId), workflowId);
                    },

                    clickUpdate: function (deploymentId) {
                        return this.selectOptionInPopupMenu(this.props.deploymentMenu(deploymentId), this.props.updateOption, '> div.menu >');
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
                        return this.waitForElementPresent(this.props.executionInProgressIcon(deploymentId), timeout, (result) => {
                            this.assert.equal(result.status, 0, 'Workflow execution on ' + deploymentId + ' in progress.');
                        });
                    },

                    checkIfWorkflowFinishedOnDeployment: function(deploymentId, timeout) {
                        return this.waitForElementNotPresent(this.props.executionInProgressIcon(deploymentId), timeout, (result) => {
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
                displayStyle: '.content div.field.displayStyle',
                saveButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            props: {
                tableView: 'table',
                listView: 'list',
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
                        return this.selectOptionInDropdown('@displayStyle', `${this.selector} ${this.elements.displayStyle.selector}`, this.props.tableView);
                    },
                    setListView: function () {
                        return this.selectOptionInDropdown('@displayStyle', `${this.selector} ${this.elements.displayStyle.selector}`, this.props.listView);

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
                formLoading: 'form.ui.form:not(.loading)',
                formNotLoading: 'form.ui.form.loading',
                blueprint: '.content div[name="blueprintName"]',
                inputsFile: '.content input[name="yamlFile"]',
                updateButton: '.actions button.button:nth-child(3):not(.disabled)',
                cancelButton: '.actions button.button.cancel:not(.loading)'
            },
            commands: [
                {
                    clickUpdate: function () {
                        return this.waitForElementVisible(this.selector)
                            .clickElement('@updateButton')
                            .waitForElementNotPresent(this.selector);
                    },
                    waitUntilFormLoaded: function () {
                        return this.waitForElementPresent('@formLoading')
                                   .waitForElementNotPresent('@formNotLoading')
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
                        return this.waitForElementVisible(this.selector)
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
                        return this.waitForElementVisible(this.selector)
                            .clickElement('@yesButton')
                            .waitForElementNotPresent(this.selector);
                    }
                }
            ]
        },
    }
};
