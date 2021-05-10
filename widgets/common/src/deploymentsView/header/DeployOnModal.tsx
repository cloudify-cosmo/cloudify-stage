import type { FunctionComponent } from 'react';
import GenericDeployModal from '../../GenericDeployModal';
import { FilterRule } from '../../filters/types';
import { DeploymentsResponse } from '../types';
import { BlueprintDeployParams } from '../../BlueprintActions';
import { i18nPrefix } from '../common';
import { getGroupIdForBatchAction } from './common';
import ExecutionGroupsActions from '../../ExecutionGroupsActions';
import DeploymentGroupsActions from '../../DeploymentGroupsActions';
import SearchActions from '../../SearchActions';
import DeploymentActions from '../../DeploymentActions';

interface DeployOnModalProps {
    filterRules: FilterRule[];
    toolbox: Stage.Types.Toolbox;
    onHide: () => void;
}

const headerT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.${suffix}`);

const DeployOnModal: FunctionComponent<DeployOnModalProps> = ({ filterRules, toolbox, onHide }) => {
    function fetchEnvironments() {
        return new SearchActions(toolbox)
            .doListDeployments(filterRules, { _include: 'id' })
            .then((response: DeploymentsResponse) => response.items.map(item => item.id));
    }

    function createDeploymentGroup(environments: string[], deploymentParameters: BlueprintDeployParams) {
        const groupId = getGroupIdForBatchAction();
        return new DeploymentGroupsActions(toolbox)
            .doCreateNewDeployments(groupId, {
                blueprint_id: deploymentParameters.blueprintId,
                default_inputs: deploymentParameters.inputs,
                labels: DeploymentActions.toManagerLabels(deploymentParameters.labels),
                visibility: deploymentParameters.visibility,
                new_deployments: environments.map(environmentId => ({
                    id: `${environmentId}-${deploymentParameters.blueprintId}-{uuid}`,
                    labels: [{ 'csys-obj-parent': environmentId }]
                }))
            })
            .then((response: { id: string }) => response.id);
    }

    function startInstallWorkflow(deploymentGroupId: string) {
        return new ExecutionGroupsActions(toolbox).doStart(deploymentGroupId, 'install');
    }

    function finalize() {
        toolbox.getEventBus().trigger('deployments:refresh').trigger('executions:refresh');
        onHide();
    }

    return (
        <GenericDeployModal
            toolbox={toolbox}
            open
            onHide={onHide}
            i18nHeaderKey={`${i18nPrefix}.header.bulkActions.deployOn.modal.header`}
            deployValidationMessage={headerT('bulkActions.deployOn.modal.steps.validatingData')}
            deployAndInstallSteps={[
                {
                    message: headerT('bulkActions.deployOn.modal.steps.fetchingEnvironments'),
                    executeStep: fetchEnvironments
                },
                {
                    message: headerT('bulkActions.deployOn.modal.steps.creatingDeployments'),
                    executeStep: createDeploymentGroup
                },
                {
                    message: headerT('bulkActions.deployOn.modal.steps.installingDeployments'),
                    executeStep: startInstallWorkflow
                },
                { executeStep: finalize }
            ]}
        />
    );
};

export default DeployOnModal;
