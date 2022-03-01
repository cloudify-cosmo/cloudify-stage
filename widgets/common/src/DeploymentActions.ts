import type { Workflow } from './executeWorkflow';

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
        return this.toolbox.getManager().doGet(`/deployments/${deployment.id}`, { params });
    }

    doGetDeployments(params: any) {
        return this.toolbox.getManager().doGet('/deployments', { params });
    }

    doDelete(deployment: { id: string }) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`);
    }

    doForceDelete(deployment: { id: string }) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`, { params: { force: 'true' } });
    }

    // eslint-disable-next-line camelcase
    doCancel(execution: { id: string; deployment_id: string }, action: string) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, {
            body: {
                deployment_id: execution.deployment_id,
                action
            }
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
        return this.toolbox.getManager().doPost('/executions', {
            body: {
                deployment_id: deploymentId,
                workflow_id: workflowId,
                dry_run: dryRun,
                force,
                queue,
                scheduled_time: scheduledTime,
                parameters: workflowParameters
            }
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
        const body: Record<string, any> = {};

        if (!_.isEmpty(blueprintName)) {
            body.blueprint_id = blueprintName;
        }

        body.skip_install = !shouldRunInstallWorkflow;
        body.skip_uninstall = !shouldRunUninstallWorkflow;
        body.install_first = installWorkflowFirst;
        body.ignore_failure = ignoreFailure;
        body.skip_reinstall = !shouldRunReinstall;
        body.reinstall_list = reinstallList;
        body.force = forceUpdate;
        body.preview = preview;

        if (!_.isEmpty(deploymentInputs)) {
            body.inputs = deploymentInputs;
        }

        return this.toolbox.getManager().doPut(`/deployment-updates/${deploymentName}/update/initiate`, { body });
    }

    doSetVisibility(deploymentId: string, visibility: any) {
        return this.toolbox
            .getManager()
            .doPatch(`/deployments/${deploymentId}/set-visibility`, { body: { visibility } });
    }

    doSetSite(deploymentId: string, siteName: string, detachSite: any) {
        const body = detachSite ? { detach_site: detachSite } : { site_name: siteName };

        return this.toolbox.getManager().doPost(`/deployments/${deploymentId}/set-site`, { body });
    }

    doGetSiteName(deploymentId: string) {
        return this.toolbox
            .getManager()
            .doGet(`/deployments/${deploymentId}?_include=site_name`)
            .then(({ site_name: siteName }) => siteName);
    }

    private doGetSites(include: string, params: Record<string, any> = {}) {
        return this.toolbox.getManager().doGet('/sites', {
            params: {
                _include: include,
                _get_all_results: true,
                ...params
            }
        });
    }

    doGetSitesNames(): Promise<Stage.Types.PaginatedResponse<Pick<Stage.Common.Map.Site, 'name'>>> {
        return this.doGetSites('name', { _sort: 'name' });
    }

    doGetSitesNamesAndLocations(): Promise<Stage.Types.PaginatedResponse<Stage.Common.Map.Site>> {
        return this.doGetSites('name,latitude,longitude');
    }

    doSetLabels(deploymentId: string, deploymentLabels: Stage.Common.Labels.Label[]) {
        const labels = DeploymentActions.toManagerLabels(deploymentLabels);
        return this.toolbox.getManager().doPatch(`/deployments/${deploymentId}`, { body: { labels } });
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

    // eslint-disable-next-line camelcase
    doGetWorkflows(deploymentId: string): Promise<{ id: string; display_name: string; workflows: Workflow[] }> {
        return this.toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=id,display_name,workflows`);
    }

    async waitUntilCreated(deploymentId: string) {
        const { ExecutionActions, PollHelper } = Stage.Common;

        const executionActions = new ExecutionActions(this.toolbox);
        const pollHelper = new PollHelper(60);
        for (;;) {
            // eslint-disable-next-line no-await-in-loop
            await pollHelper.wait();

            // eslint-disable-next-line no-await-in-loop
            const { items } = await executionActions.doGetAll({
                deployment_id: deploymentId,
                _include: _.join(['id', 'status', 'ended_at'])
            });

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
