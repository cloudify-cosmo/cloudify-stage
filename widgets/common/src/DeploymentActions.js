/**
 * Created by kinneretzin on 19/10/2016.
 */

class DeploymentActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGet(deployment) {
        return this.toolbox.getManager().doGet(`/deployments/${deployment.id}`);
    }

    doDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`);
    }

    doForceDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`, {ignore_live_nodes: 'true'});
    }

    doCancel(execution,action) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'deployment_id': execution.deployment_id,
            'action': action
        });
    }

    doExecute(deployment,workflow,params) {
        return this.toolbox.getManager().doPost('/executions',null,{
            'deployment_id': deployment.id,
            'workflow_id' : workflow.name,
            parameters: params
        });
    }

    doUpdate(deploymentName, applicationFileName, blueprintArchiveUrl, defaultWorkflow,
             installWorkflow, uninstallWorkflow, workflowId, blueprintArchive, inputs) {
        var params = {};
        if (!_.isEmpty(applicationFileName)) {
            params['application_file_name'] = applicationFileName + ".yaml";
        }
        if (!_.isEmpty(blueprintArchiveUrl)) {
            params['blueprint_archive_url'] = blueprintArchiveUrl;
        }
        if (defaultWorkflow) {
            params['skip_install'] = !installWorkflow;
            params['skip_uninstall'] = !uninstallWorkflow;
        } else {
            params['workflow_id'] = workflowId;
        }

        if (blueprintArchive || inputs) {
            var files = {};
            if (blueprintArchive) {
                files['blueprint_archive'] = blueprintArchive;
            }
            if (inputs) {
                files['inputs'] = inputs;
            }

            return this.toolbox.getManager().doUpload(`/deployment-updates/${deploymentName}/update/initiate`, params, files, 'post');
        } else {
            return this.toolbox.getManager().doPost(`/deployment-updates/${deploymentName}/update/initiate`, params);
        }
    }

}

Stage.defineCommon({
    name: 'DeploymentActions',
    common: DeploymentActions
});