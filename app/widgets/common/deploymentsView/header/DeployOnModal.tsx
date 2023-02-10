import type { FunctionComponent } from 'react';
import React from 'react';
import type { WorkflowParameters } from '../../executeWorkflow';
import GenericDeployModal from '../../deployModal/GenericDeployModal';
import type { GenericDeployModalProps } from '../../deployModal/GenericDeployModal';
import type { FilterRule } from '../../filters/types';
import type { BlueprintDeployParams } from '../../blueprints/BlueprintActions';
import { i18nPrefix, parentDeploymentLabelKey } from '../common';
import { getGroupIdForBatchAction } from './common';
import ExecutionGroupsActions from './ExecutionGroupsActions';
import DeploymentGroupsActions from '../../deployments/DeploymentGroupsActions';
import SearchActions from '../../actions/SearchActions';
import DeploymentActions from '../../deployments/DeploymentActions';
import ExecutionStartedModal from './ExecutionStartedModal';
import StageUtils from '../../../../utils/stageUtils';
import { useBoolean } from '../../../../utils/hooks';
import type { Deployment } from '../types';

export interface DeployOnModalProps {
    filterRules: FilterRule[];
    toolbox: Stage.Types.Toolbox;
    onHide: () => void;
    selectedDeployment?: Deployment;
}

const tModal = StageUtils.getT(`${i18nPrefix}.header.bulkActions.deployOn.modal`);

const DeployOnModal: FunctionComponent<DeployOnModalProps> = ({ filterRules, toolbox, selectedDeployment, onHide }) => {
    const [executionStarted, setExecutionStarted] = useBoolean();
    const environmentToDeployOn: GenericDeployModalProps['environmentToDeployOn'] = selectedDeployment
        ? {
              displayName: selectedDeployment.display_name,
              id: selectedDeployment.id
          }
        : undefined;

    function fetchEnvironments() {
        return new SearchActions(toolbox)
            .doListAllDeployments(filterRules, { _include: 'id' })
            .then(response => response.items.map(item => item.id));
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
            showDeployButton
            deployValidationMessage={tModal('deploySteps.validatingData')}
            deploySteps={[
                {
                    message: tModal('deploySteps.fetchingEnvironments'),
                    executeStep: fetchEnvironments
                },
                {
                    message: tModal('deploySteps.creatingDeployments'),
                    executeStep: createDeploymentGroup
                },
                { executeStep: closeModal }
            ]}
            deployAndInstallValidationMessage={tModal('deployAndInstallSteps.validatingData')}
            deployAndInstallSteps={[
                {
                    message: tModal('deployAndInstallSteps.fetchingEnvironments'),
                    executeStep: fetchEnvironments
                },
                {
                    message: tModal('deployAndInstallSteps.creatingDeployments'),
                    executeStep: createDeploymentGroup
                },
                {
                    message: tModal('deployAndInstallSteps.installingDeployments'),
                    executeStep: startInstallWorkflow
                },
                { executeStep: setExecutionStarted }
            ]}
            showDeploymentNameInput
            deploymentNameLabel={tModal('inputs.name.label')}
            deploymentNameHelp={tModal('inputs.name.help')}
            environmentToDeployOn={environmentToDeployOn}
        />
    );
};

export default DeployOnModal;
