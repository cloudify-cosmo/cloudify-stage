// @ts-nocheck File not migrated fully to TS
import type { ComponentProps, FunctionComponent } from 'react';
import GenericDeployModal from './GenericDeployModal';
import BlueprintActions, { BlueprintDeployParams } from './BlueprintActions';
import DeploymentActions, { WorkflowOptions } from './DeploymentActions';

const t = (key: string, options?: Record<string, any>) =>
    Stage.i18n.t(`widgets.common.deployments.deployModal.${key}`, options);

type DeployBlueprintModalProps = Pick<
    ComponentProps<typeof GenericDeployModal>,
    'open' | 'onHide' | 'blueprintId' | 'toolbox'
>;

const DeployBlueprintModal: FunctionComponent<DeployBlueprintModalProps> = ({ toolbox, onHide, ...rest }) => {
    function deployBlueprint(_: undefined, params: BlueprintDeployParams) {
        // @ts-expect-error Properties do not exist on type 'typeof Common'
        const { InputsUtils } = Stage.Common;

        const blueprintActions = new BlueprintActions(toolbox);
        return blueprintActions
            .doDeploy(params)
            .then(deployment => deployment.id)
            .catch((err: { message: string }) => Promise.reject(InputsUtils.getErrorObject(err.message)));
    }

    function waitForDeploymentIsCreated(deploymentId: string, { deploymentName }: BlueprintDeployParams) {
        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .waitUntilCreated(deploymentId)
            .then(() => deploymentId)
            .catch(error => Promise.reject(t('errors.deploymentCreationFailed', { deploymentName, error })));
    }

    function installDeployment(
        deploymentId: string,
        { deploymentName }: BlueprintDeployParams,
        installWorkflowParameters: Record<string, any>,
        installWorkflowOptions: WorkflowOptions
    ) {
        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .doExecute(deploymentId, 'install', installWorkflowParameters, installWorkflowOptions)
            .then(() => deploymentId)
            .catch(error =>
                Promise.reject({
                    errors: t('errors.deploymentInstallationFailed', {
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rest}
            toolbox={toolbox}
            onHide={onHide}
            i18nHeaderKey="widgets.common.deployments.deployModal.header"
            showDeploymentNameInput
            showDeployButton
            showInstallOptions
            showSitesInput
            deployValidationMessage={t('steps.deploy.validatingData')}
            deploySteps={[
                { message: t('steps.deploy.deployingBlueprint'), executeStep: deployBlueprint },
                { executeStep: finalizeDeploy }
            ]}
            deployAndInstallValidationMessage={t('steps.deployAndInstall.validatingData')}
            deployAndInstallSteps={[
                { message: t('steps.deployAndInstall.deployingBlueprint'), executeStep: deployBlueprint },
                { message: t('steps.deployAndInstall.waitingForDeployment'), executeStep: waitForDeploymentIsCreated },
                { message: t('steps.deployAndInstall.installingDeployment'), executeStep: installDeployment },
                { executeStep: finalizeDeployAndInstall }
            ]}
        />
    );
};

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { DeployBlueprintModal };
    }
}

Stage.defineCommon({
    name: 'DeployBlueprintModal',
    common: DeployBlueprintModal
});
