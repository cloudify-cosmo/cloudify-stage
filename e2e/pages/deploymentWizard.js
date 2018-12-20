/**
 * Created by jakub.niezgoda on 19/09/2018.
 */

module.exports = {
    elements: {
        helloWorldWizardButton: 'div.deploymentWizardButtonsWidget button.red.widgetButton',
        deploymentWizardButton: 'div.deploymentWizardButtonsWidget button.teal.widgetButton',

        wizardModal: 'div.wizardModal',

        closeButton: 'div.wizardModal div.actions i.cancel.icon',
        backButton: 'div.wizardModal div.actions i.arrow.left.icon',
        nextButton: 'div.wizardModal div.actions i.arrow.right.icon',
        installButton: 'div.wizardModal div.actions i.download.icon',
        loadingBlock: 'div.wizardModal .ui.loading',
        errorMessage: 'div.wizardModal div.error.message div.content'
    },

    props: {
        widgetId: 'deploymentWizardButtons'
    },

    commands: [
        {
            openHelloWorldWizard: function() {
                this.clickElement('@helloWorldWizardButton');
                return this;
            },

            openDeploymentWizard: function() {
                this.clickElement('@deploymentWizardButton');
                return this;
            },

            closeWizard: function() {
                this.clickElement('@closeButton')
                    .clickElement('div.confirmModal button.primary.button')
                    .waitForElementNotPresent('@wizardModal');
                return this;
            },

            goToNextStep: function(expectedNextStep) {
                this.clickElement('@nextButton')
                    .waitForElementVisible(this.section[expectedNextStep].selector)
                    .waitForElementNotPresent('@loadingBlock');
                return this;
            },

            goToPreviousStep: function (expectedPreviousStep) {
                this.clickElement('@backButton')
                    .waitForElementVisible(this.section[expectedPreviousStep].selector)
                    .waitForElementNotPresent('@loadingBlock');
                return this;
            },

            clickInstall: function () {
                this.clickElement('@installButton')
                    .waitForElementVisible(this.section['installStep'].selector);
                return this;
            },

            checkIfErrorPresent: function (errorMessage) {
                return this
                    .waitForElementVisible('@errorMessage')
                    .assert.containsText('@errorMessage', errorMessage);
            },

            waitForReadiness: function () {
                return this.waitForElementNotPresent('@loadingBlock');
            }
        }
    ],

    sections: {
        blueprintStep: {
            selector: 'div.wizardModal.blueprintStep',
            elements: {
                blueprintFile: "input[name='blueprintFile']",
                blueprintYamlDropdownTriggerElement: "div[name='blueprintFileName']",
                blueprintYamlDropdownElement: "div[name='blueprintFileName'] div[role='listbox']",
                loadingBlock: 'form.ui.loading'
            },
            commands: [
                {
                    setBlueprintPackage: function (fileName) {
                        this.setElementValue('@blueprintFile', fileName)
                            .waitForElementNotPresent('@loadingBlock');
                        return this;
                    },
                    setBlueprintYamlFile: function (yamlFile) {
                        this.selectOptionInDropdown('@blueprintYamlDropdownTriggerElement',
                                                    this.elements.blueprintYamlDropdownElement.selector,
                                                    yamlFile);
                        return this;
                    }
                }
            ]
        },

        infrastructureStep: {
            selector: 'div.wizardModal.infrastructureStep',
            props: {
                yamlButton : (yaml) => `button[name='${yaml}']`
            },
            commands: [
                {
                    selectYaml: function (yaml) {
                        this.clickElement(this.props.yamlButton(yaml));
                        return this;
                    }
                }
            ]
        },

        pluginsStep: {
            selector: 'div.wizardModal.pluginsStep',
            elements: {
                addUserPluginButton: 'i.add.icon',
            },
            props: {
                pluginRow: (pluginName) => `tr[name='${pluginName}']`,
                pluginStatus: (secretKey, actionRequired) =>
                    `tr[name='${secretKey}'] ${actionRequired ? 'i.yellow.warning.icon' : 'i.green.check.icon'}`,
                removeUserPluginButton: (pluginName) => `tr[name='${pluginName}'] i.minus.icon`
            },
            commands: [
                {
                    checkIfPluginPresent: function (pluginName, actionRequired) {
                        this.waitForElementPresent(this.props.pluginRow(pluginName), (result) => {
                            this.assert.equal(result.status, 0, 'Plugin ' + pluginName + ' present.');
                        });
                        this.waitForElementPresent(this.props.pluginStatus(pluginName, actionRequired), (result) => {
                            this.assert.equal(result.status, 0,
                                'Plugin ' + pluginName + (actionRequired ? ' requires' : ' does not require') + ' an action');
                        });
                        return this;
                    },

                    addUserPlugin: function (wagonUrl, yamlUrl, expectedPluginName = 'user-plugin-0') {
                        this.clickElement('@addUserPluginButton')
                            .waitForElementPresent(this.props.pluginRow(expectedPluginName));
                        return this;
                    },

                    removeUserPlugin: function (pluginName) {
                        this.clickElement(this.props.removeUserPluginButton(pluginName))
                            .waitForElementNotPresent(this.props.pluginRow(pluginName));
                        return this;
                    }
                }
            ]
        },

        secretsStep: {
            selector: 'div.wizardModal.secretsStep',
            props: {
                secretRow: (secretKey) => `tr[name='${secretKey}']`,
                secretStatus: (secretKey, actionRequired) =>
                    `tr[name='${secretKey}'] ${actionRequired ? 'i.yellow.warning.icon' : 'i.green.check.icon'}`,
                secretInput: (secretKey) => `tr[name='${secretKey}'] input[name='${secretKey}']`,
            },
            commands: [
                {
                    checkIfSecretPresent: function (secretKey, actionRequired) {
                        this.waitForElementPresent(this.props.secretRow(secretKey), (result) => {
                            this.assert.equal(result.status, 0, 'Secret ' + secretKey + ' present.');
                        });
                        this.waitForElementPresent(this.props.secretStatus(secretKey, actionRequired), (result) => {
                            this.assert.equal(result.status, 0,
                                'Secret ' + secretKey + (actionRequired ? ' requires' : ' does not require') + ' an action');
                        });
                        return this;
                    },
                    setSecretValue: function (secretKey, secretValue) {
                        return this.setElementValue(this.props.secretInput(secretKey), secretValue);
                    }
                }
            ]
        },

        inputsStep: {
            selector: 'div.wizardModal.inputsStep',
            props: {
                inputRow: (inputName) => `tr[name='${inputName}']`,
                inputStatus: (inputName, actionRequired) =>
                    `tr[name='${inputName}'] ${actionRequired ? 'i.yellow.warning.icon' : 'i.green.check.icon'}`,
                inputInput: (inputName) => `tr[name='${inputName}'] input[name='${inputName}']`,
            },
            commands: [
                {
                    checkIfInputPresent: function (inputName, actionRequired) {
                        this.waitForElementPresent(this.props.inputRow(inputName), (result) => {
                            this.assert.equal(result.status, 0, 'Input ' + inputName + ' present.');
                        });
                        this.waitForElementPresent(this.props.inputStatus(inputName, actionRequired), (result) => {
                            this.assert.equal(result.status, 0,
                                'Input ' + inputName + (actionRequired ? ' requires' : ' does not require') + ' an action');
                        });
                        return this;
                    },
                    setInputValue: function (inputName, inputValue) {
                        return this.setElementValue(this.props.inputInput(inputName), inputValue);
                    }
                }
            ]
        },

        confirmStep: {
            selector: 'div.wizardModal.confirmStep',
            elements: {
            },
            props: {
                taskElement: (index) => `div.list div.item:nth-child(${index})`
            },
            commands: [
                {
                    checkIfTaskPresent: function (index, taskDescription) {
                        return this
                            .waitForElementVisible(this.props.taskElement(index))
                            .assert.containsText(this.props.taskElement(index), taskDescription);
                    }
                }
            ]
        },

        installStep: {
            selector: 'div.wizardModal.installStep',
            elements: {
                successProgressBar: 'div.progress.success',
                failedProgressBar: 'div.progress.error',
                progressBarLabel: 'div.progress div.label',
                stayOnThisPageButton: 'i.icon.hand.paper',
            },
            props: {
                installationTimeout: 2*60*1000 // 2 minutes
            },
            commands: [
                {
                    checkIfInstallInProgress: function () {
                        return this
                            .waitForElementVisible('@progressBarLabel')
                            .assert.containsText('@progressBarLabel', 'Installation in progress...');
                    },
                    checkIfInstallStarted: function () {
                        return this
                            .waitForElementVisible('@successProgressBar', this.props.installationTimeout)
                            .assert.containsText('@progressBarLabel', 'Installation started!');
                    },
                    cancelRedirection: function () {
                        return this.clickElement('@stayOnThisPageButton');
                    },
                    checkIfInstallFailed: function () {
                        return this
                            .waitForElementVisible('@failedProgressBar', this.props.installationTimeout)
                            .assert.containsText('@progressBarLabel', 'Installation failed. Check error details above.');
                    }
                }
            ]
        }
    }
};
