import type { FunctionComponent } from 'react';
import type { WorkflowParameters } from '../../executeWorkflow';
import GenericDeployModal from '../../deployModal/GenericDeployModal';
import { FilterRule } from '../../filters/types';
import { DeploymentsResponse } from '../types';
import { BlueprintDeployParams } from '../../BlueprintActions';
import { i18nPrefix, parentDeploymentLabelKey } from '../common';
import { getGroupIdForBatchAction } from './common';
import ExecutionGroupsActions from '../../ExecutionGroupsActions';
import DeploymentGroupsActions from '../../DeploymentGroupsActions';
import SearchActions from '../../SearchActions';
import DeploymentActions from '../../DeploymentActions';
import ExecutionStartedModal from './ExecutionStartedModal';

interface DeployOnModalProps {
    filterRules: FilterRule[];
    toolbox: Stage.Types.Toolbox;
    onHide: () => void;
}

const t = Stage.Utils.getT(`${i18nPrefix}.header`);

const DeployOnModal: FunctionComponent<DeployOnModalProps> = ({ filterRules, toolbox, onHide }) => {
    const [executionStarted, setExecutionStarted] = Stage.Hooks.useBoolean();

    function fetchEnvironments() {
        return new SearchActions(toolbox)
            .doListAllDeployments(filterRules, { _include: 'id' })
            .then((response: DeploymentsResponse) => response.items.map(item => item.id));
    }

    function createDeploymentGroup(environments: string[], deploymentParameters: BlueprintDeployParams) {
        const groupId = getGroupIdForBatchAction();
        return new DeploymentGroupsActions(toolbox)
            .doCreate(groupId, {
                blueprint_id: deploymentParameters.blueprintId,
                default_inputs: deploymentParameters.inputs,
                labels: DeploymentActions.toManagerLabels(deploymentParameters.labels),
                visibility: deploymentParameters.visibility,
                new_deployments: environments.map(environmentId => ({
                    id: '{uuid}',
                    display_name: `{blueprint_id}-${deploymentParameters.deploymentName}`,
                    labels: [{ [parentDeploymentLabelKey]: environmentId }],
                    runtime_only_evaluation: deploymentParameters.runtimeOnlyEvaluation,
                    skip_plugins_validation: deploymentParameters.skipPluginsValidation
                }))
            })
            .then((response: { id: string }) => response.id);
    }

    function startInstallWorkflow(
        deploymentGroupId: string,
        _deploymentParameters: BlueprintDeployParams,
        installWorkflowParameters: WorkflowParameters | undefined
    ) {
        return new ExecutionGroupsActions(toolbox).doStart(deploymentGroupId, 'install', installWorkflowParameters);
    }

    function closeModal() {
        toolbox.getEventBus().trigger('deployments:refresh').trigger('executions:refresh');
        onHide();
    }

    return executionStarted ? (
        <ExecutionStartedModal toolbox={toolbox} onClose={closeModal} />
    ) : (
        <GenericDeployModal
            toolbox={toolbox}
            open
            onHide={onHide}
            i18nHeaderKey={`${i18nPrefix}.header.bulkActions.deployOn.modal.header`}
            deployValidationMessage={t('bulkActions.deployOn.modal.steps.validatingData')}
            deployAndInstallSteps={[
                {
                    message: t('bulkActions.deployOn.modal.steps.fetchingEnvironments'),
                    executeStep: fetchEnvironments
                },
                {
                    message: t('bulkActions.deployOn.modal.steps.creatingDeployments'),
                    executeStep: createDeploymentGroup
                },
                {
                    message: t('bulkActions.deployOn.modal.steps.installingDeployments'),
                    executeStep: startInstallWorkflow
                },
                { executeStep: setExecutionStarted }
            ]}
            showDeploymentNameInput
            deploymentNameLabel={t('bulkActions.deployOn.modal.inputs.name.label')}
            deploymentNameHelp={t('bulkActions.deployOn.modal.inputs.name.help')}
        />
    );
};

export default DeployOnModal;
