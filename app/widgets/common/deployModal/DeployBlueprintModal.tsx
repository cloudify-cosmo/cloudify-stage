import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import type { BlueprintDeployParams } from '../blueprints/BlueprintActions';
import BlueprintActions from '../blueprints/BlueprintActions';
import type { WorkflowOptions } from '../deployments/DeploymentActions';
import DeploymentActions from '../deployments/DeploymentActions';
import type { WorkflowParameters } from '../executeWorkflow';
import GenericDeployModal from './GenericDeployModal';
import { getErrorObject } from '../inputs/utils/errors';

const translate = (key: string, options?: Record<string, any>) =>
    i18n.t(`widgets.common.deployments.deployModal.${key}`, options);

type DeployBlueprintModalProps = Pick<
    ComponentProps<typeof GenericDeployModal>,
    'open' | 'onHide' | 'blueprintId' | 'toolbox' | 'blueprintFilterRules' | 'environmentToDeployOn'
> &
    Pick<Partial<ComponentProps<typeof GenericDeployModal>>, 'i18nHeaderKey'>;

const DeployBlueprintModal: FunctionComponent<DeployBlueprintModalProps> = ({
    toolbox,
    onHide,
    i18nHeaderKey = 'widgets.common.deployments.deployModal.header',
    ...rest
}) => {
    function deployBlueprint(_: undefined, params: BlueprintDeployParams) {
        const blueprintActions = new BlueprintActions(toolbox);
        return blueprintActions
            .doDeploy(params)
            .then(deployment => deployment.id)
            .catch((err: { message: string }) => Promise.reject(getErrorObject(err.message)));
    }

    function waitForDeploymentIsCreated(deploymentId: string, { deploymentName }: BlueprintDeployParams) {
        const deploymentActions = new DeploymentActions(toolbox.getManager());

        return deploymentActions
            .waitUntilCreated(deploymentId)
            .then(() => deploymentId)
            .catch(error => Promise.reject(translate('errors.deploymentCreationFailed', { deploymentName, error })));
    }

    function installDeployment(
        deploymentId: string,
        { deploymentName }: BlueprintDeployParams,
        installWorkflowParameters?: WorkflowParameters,
        installWorkflowOptions?: WorkflowOptions
    ) {
        const deploymentActions = new DeploymentActions(toolbox.getManager());

        return deploymentActions
            .doExecute(deploymentId, 'install', installWorkflowParameters, installWorkflowOptions)
            .then(() => deploymentId)
            .catch(error =>
                Promise.reject({
                    errors: translate('errors.deploymentInstallationFailed', {
                        deploymentName,
                        error: error.message
                    })
                })
            );
    }

    function openDeploymentPage(deploymentId: string, deploymentName: string) {
        toolbox.drillDown(toolbox.getWidget(), 'deployment', { deploymentId }, deploymentName);
    }

    function finalizeDeployAndInstall(deploymentId: string, params: BlueprintDeployParams) {
        finalizeDeploy(deploymentId, params);
        toolbox.getEventBus().trigger('executions:refresh');
    }

    function finalizeDeploy(deploymentId: string, { deploymentName }: BlueprintDeployParams) {
        toolbox.getEventBus().trigger('deployments:refresh');
        onHide();
        openDeploymentPage(deploymentId, deploymentName);
    }

    return (
        <GenericDeployModal
            {...rest}
            toolbox={toolbox}
            onHide={onHide}
            i18nHeaderKey={i18nHeaderKey}
            showDeploymentNameInput
            showDeploymentIdInput
            showDeployButton
            showInstallOptions
            showSitesInput
            deployValidationMessage={translate('steps.deploy.validatingData')}
            deploySteps={[
                { message: translate('steps.deploy.deployingBlueprint'), executeStep: deployBlueprint },
                { executeStep: finalizeDeploy }
            ]}
            deployAndInstallValidationMessage={translate('steps.deployAndInstall.validatingData')}
            deployAndInstallSteps={[
                { message: translate('steps.deployAndInstall.deployingBlueprint'), executeStep: deployBlueprint },
                {
                    message: translate('steps.deployAndInstall.waitingForDeployment'),
                    executeStep: waitForDeploymentIsCreated
                },
                { message: translate('steps.deployAndInstall.installingDeployment'), executeStep: installDeployment },
                { executeStep: finalizeDeployAndInstall }
            ]}
        />
    );
};

export default DeployBlueprintModal;
