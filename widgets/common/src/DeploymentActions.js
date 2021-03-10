/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class DeploymentActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    static toManagerLabels(labels) {
        return _.map(labels, ({ key, value }) => ({ [key]: value }));
    }

    doGet(deployment, params) {
        return this.toolbox.getManager().doGet(`/deployments/${deployment.id}`, params);
    }

    doGetDeployments(params) {
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

    doExecute(deployment, workflow, params, force, dry_run = false, queue = false, scheduled_time = undefined) {
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
        deploymentInputs,
        shouldRunInstallWorkflow,
        shouldRunUninstallWorkflow,
        installWorkflowFirst,
        ignoreFailure,
        shouldRunReinstall,
        reinstallList,
        forceUpdate,
        preview
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

    doSetSite(deploymentId, siteName, detachSite) {
        const data = detachSite ? { detach_site: detachSite } : { site_name: siteName };

        return this.toolbox.getManager().doPost(`/deployments/${deploymentId}/set-site`, null, data);
    }

    doGetSiteName(deploymentId) {
        return this.toolbox
            .getManager()
            .doGet(`/deployments/${deploymentId}?_include=site_name`)
            .then(({ site_name: siteName }) => siteName);
    }

    doGetSites() {
        return this.toolbox.getManager().doGet('/sites?_include=name&_sort=name');
    }

    doSetLabels(deploymentId, deploymentLabels) {
        const labels = DeploymentActions.toManagerLabels(deploymentLabels);
        return this.toolbox.getManager().doPatch(`/deployments/${deploymentId}`, null, { labels });
    }

    doGetLabels(deploymentId) {
        return this.toolbox
            .getManager()
            .doGet(`/deployments/${deploymentId}?_include=labels`)
            .then(({ labels }) => labels);
    }

    async waitUntilCreated(deploymentId) {
        const { ExecutionActions, PollHelper } = Stage.Common;

        const executionActions = new ExecutionActions(this.toolbox);
        const pollHelper = new PollHelper(60);
        for (;;) {
            // eslint-disable-next-line no-await-in-loop
            await pollHelper.wait();

            // eslint-disable-next-line no-await-in-loop
            const { items } = await executionActions.doGetExecutions(deploymentId);

            if (!_.isEmpty(items) && _.isUndefined(_.find(items, { ended_at: null }))) {
                return;
            }
        }
    }
}

Stage.defineCommon({
    name: 'DeploymentActions',
    common: DeploymentActions
});
