/**
 * Created by jakub.niezgoda on 26/07/2018.
 */

import WizardButton from './WizardButton';
import BlueprintStep from './steps/BlueprintStep';
import InfrastructureStep from './steps/InfrastructureStep';
import PluginsStep from './steps/PluginsStep';
import SecretsStep from './steps/SecretsStep';
import InputsStep from './steps/InputsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import InstallStep from './steps/InstallStep';
import React from 'react';

Stage.defineWidget({
    id: 'deploymentWizardButtons',
    name: 'Deployment Wizard Buttons',
    description: 'Shows buttons to start deployment wizard',
    initialWidth: 2,
    initialHeight: 8,
    hasStyle: true,
    isReact: true,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [
        {id: 'showHelloWorldWizardButton', name: 'Show Hello World Wizard button',
            default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: 'helloWorldWizardButtonLabel', name: 'Hello World Wizard button label',
            default: 'Hello World Wizard', type: Stage.Basic.GenericField.STRING_TYPE},
        {id: 'showDeploymentWizardButton', name: 'Show Deployment Wizard button',
            default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: 'deploymentWizardButtonLabel', name: 'Deployment Wizard button label',
            default: 'Deployment Wizard', type: Stage.Basic.GenericField.STRING_TYPE}
    ],
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentWizardButtons'),

    render: function(widget, data, error, toolbox) {
        let {Divider} = Stage.Basic;

        const helloWorldWizardSteps = [
            InfrastructureStep,
            PluginsStep,
            SecretsStep,
            InputsStep,
            ConfirmationStep,
            InstallStep
        ];
        const deploymentWizardSteps = [
            BlueprintStep,
            PluginsStep,
            SecretsStep,
            InputsStep,
            ConfirmationStep,
            InstallStep
        ];
        const {
            showHelloWorldWizardButton = true,
            showDeploymentWizardButton = true,
            helloWorldWizardButtonLabel = 'Hello World Wizard',
            deploymentWizardButtonLabel = 'Deployment Wizard'
        } = widget.configuration;

        return (
            <React.Fragment>
            {
                showHelloWorldWizardButton &&
                <WizardButton color='green' icon='globe' name={helloWorldWizardButtonLabel}
                              wizardTitle='Hello World Wizard'
                              steps={helloWorldWizardSteps} toolbox={toolbox} />
            }
            {
                showHelloWorldWizardButton && showDeploymentWizardButton &&
                <Divider hidden />
            }
            {
                showDeploymentWizardButton &&
                <WizardButton color='violet' icon='wizard' name={deploymentWizardButtonLabel}
                              wizardTitle='Deployment Wizard'
                              steps={deploymentWizardSteps}
                              toolbox={toolbox} />
            }
            </React.Fragment>
        );
    }

});