/**
 * Created by kinneretzin on 19/10/2016.
 */

import { Constants } from './utils';

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`);
    }

    doCancel(execution,force) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'deployment_id': execution.deployment_id,
            'action': force ? Constants.EXECUTION_FORCE_CANCEL_ACTION : Constants.EXECUTION_CANCEL_ACTION
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