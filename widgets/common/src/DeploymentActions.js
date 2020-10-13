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

    doGetDeployments(params = null) {
        return this.toolbox.getManager().doGet('/deployments?_include=id', params);
    }

    doDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`);
    }

    doForceDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`, { force: 'true' });
    }

    doCancel(execution, action) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            deployment_id: execution.deployment_id,
            action
        });
    }

    doExecute(deployment, workflow, params, force = false, dry_run = false, queue = false, scheduled_time = undefined) {
        return this.toolbox.getManager().doPost('/executions', null, {
            deployment_id: deployment.id,
            workflow_id: workflow.name,
            dry_run,
            force,
            queue,
            scheduled_time,
            parameters: params
        });
    }

    doUpdate(
        deploymentName,
        blueprintName,
        deploymentInputs = {},
        shouldRunInstallWorkflow = true,
        shouldRunUninstallWorkflow = true,
        installWorkflowFirst = false,
        ignoreFailure = false,
        shouldRunReinstall = true,
        reinstallList = [],
        forceUpdate = false,
        preview = false
    ) {
        const data = {};

        if (!_.isEmpty(blueprintName)) {
            data.blueprint_id = blueprintName;
        }

        data.skip_install = !shouldRunInstallWorkflow;
        data.skip_uninstall = !shouldRunUninstallWorkflow;
        data.install_first = installWorkflowFirst;
        data.ignore_failure = ignoreFailure;
        data.skip_reinstall = !shouldRunReinstall;
        data.reinstall_list = reinstallList;
        data.force = forceUpdate;
        data.preview = preview;

        if (!_.isEmpty(deploymentInputs)) {
            data.inputs = deploymentInputs;
        }

        return this.toolbox.getManager().doPut(`/deployment-updates/${deploymentName}/update/initiate`, null, data);
    }

    doSetVisibility(deploymentId, visibility) {
        return this.toolbox.getManager().doPatch(`/deployments/${deploymentId}/set-visibility`, null, { visibility });
    }

    doSetSite(deploymentId, siteName = null, detachSite = false) {
        const data = { detach_site: detachSite };
        if (siteName) {
            data.site_name = siteName;
        }

        return this.toolbox.getManager().doPost(`/deployments/${deploymentId}/set-site`, null, data);
    }

    doGetSites() {
        return this.toolbox.getManager().doGet('/sites?_include=name&_sort=name');
    }

    async waitUntilCreated(deploymentId, maxNumberOfRetries = 60, waitingInterval = 1000 /* ms */) {
        const { ExecutionActions } = Stage.Common;

        const executionActions = new ExecutionActions(this.toolbox);
        let deploymentCreated = false;
        for (let i = 0; i < maxNumberOfRetries && !deploymentCreated; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise(resolve => {
                setTimeout(resolve, waitingInterval);
            })
                .then(() => executionActions.doGetExecutions(deploymentId))
                // eslint-disable-next-line no-loop-func
                .then(({ items }) => {
                    deploymentCreated = !_.isEmpty(items) && _.isUndefined(_.find(items, { ended_at: null }));
                });
        }

        if (deploymentCreated) {
            return Promise.resolve();
        }
        const timeout = Math.floor((maxNumberOfRetries * waitingInterval) / 1000);
        return Promise.reject(`Timeout exceeded. Deployment was not created after ${timeout} seconds.`);
    }
}

Stage.defineCommon({
    name: 'DeploymentActions',
    common: DeploymentActions
});
