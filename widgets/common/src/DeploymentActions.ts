export interface WorkflowOptions {
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    scheduledTime: any;
}

export default class DeploymentActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    static toManagerLabels(labels: Stage.Common.Labels.Label[]) {
        return _.map(labels, ({ key, value }) => ({ [key]: value }));
    }

    doGet(deployment: { id: string }, params: any) {
        return this.toolbox.getManager().doGet(`/deployments/${deployment.id}`, params);
    }

    doGetDeployments(params: any) {
        return this.toolbox.getManager().doGet('/deployments?_include=id', params);
    }

    doDelete(deployment: { id: string }) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`);
    }

    doForceDelete(deployment: { id: string }) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`, { force: 'true' });
    }

    // eslint-disable-next-line camelcase
    doCancel(execution: { id: string; deployment_id: string }, action: string) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            deployment_id: execution.deployment_id,
            action
        });
    }

    doExecute(
        deploymentId: string,
        workflowId: string,
        workflowParameters: Record<string, any> = {},
        { force, dryRun, queue, scheduledTime }: WorkflowOptions = {
            force: false,
            dryRun: false,
            queue: false,
            scheduledTime: undefined
        }
    ) {
        return this.toolbox.getManager().doPost('/executions', null, {
            deployment_id: deploymentId,
            workflow_id: workflowId,
            dry_run: dryRun,
            force,
            queue,
            scheduled_time: scheduledTime,
            parameters: workflowParameters
        });
    }

    doUpdate(
        deploymentName: string,
        blueprintName: string,
        deploymentInputs: any,
        shouldRunInstallWorkflow: boolean,
        shouldRunUninstallWorkflow: boolean,
        installWorkflowFirst: boolean,
        ignoreFailure: boolean,
        shouldRunReinstall: boolean,
        reinstallList: any,
        forceUpdate: boolean,
        preview: boolean
    ) {
        const data: Record<string, any> = {};

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

    doSetVisibility(deploymentId: string, visibility: any) {
        return this.toolbox.getManager().doPatch(`/deployments/${deploymentId}/set-visibility`, null, { visibility });
    }

    doSetSite(deploymentId: string, siteName: string, detachSite: any) {
        const data = detachSite ? { detach_site: detachSite } : { site_name: siteName };

        return this.toolbox.getManager().doPost(`/deployments/${deploymentId}/set-site`, null, data);
    }

    doGetSiteName(deploymentId: string) {
        return this.toolbox
            .getManager()
            .doGet(`/deployments/${deploymentId}?_include=site_name`)
            .then(({ site_name: siteName }) => siteName);
    }

    private doGetSites(include: string) {
        return this.toolbox.getManager().doGet('/sites', {
            _include: include,
            _get_all_results: true
        });
    }

    doGetSitesNames() {
        return this.doGetSites('name');
    }

    doGetSitesNamesAndLocations() {
        return this.doGetSites('name,latitude,longitude');
    }

    doSetLabels(deploymentId: string, deploymentLabels: Stage.Common.Labels.Label[]) {
        const labels = DeploymentActions.toManagerLabels(deploymentLabels);
        return this.toolbox.getManager().doPatch(`/deployments/${deploymentId}`, null, { labels });
    }

    doGetLabel(key: string, value: string) {
        return this.toolbox.getManager().doGet(`/labels/deployments/${key}?_search=${value}`);
    }

    doGetLabels(deploymentId: string) {
        return this.toolbox
            .getManager()
            .doGet(`/deployments/${deploymentId}?_include=labels`)
            .then(({ labels }) => labels);
    }

    doGetReservedLabelKeys() {
        return this.toolbox
            .getManager()
            .doGet('/labels/deployments?_reserved=true')
            .then(({ items }) => items);
    }

    doGetWorkflows(deploymentId: string) {
        return this.toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=id,workflows`);
    }

    async waitUntilCreated(deploymentId: string) {
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

declare global {
    namespace Stage.Common {
        export { DeploymentActions };
    }
}

Stage.defineCommon({
    name: 'DeploymentActions',
    common: DeploymentActions
});
