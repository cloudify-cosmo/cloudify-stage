import type { Manager } from 'cloudify-ui-components/toolbox';
import type { PaginatedResponse } from 'backend/types';
import type { Deployment } from 'app/widgets/common/deploymentsView/types';
import type { Visibility } from 'app/widgets/common/types';
import type { Workflow } from '../executeWorkflow';
import ExecutionActions from '../executions/ExecutionActions';
import type { Label } from '../labels/types';
import type { Site } from '../map/site';
import PollHelper from '../utils/PollHelper';

export interface WorkflowOptions {
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    scheduledTime: any;
}

export default class DeploymentActions {
    constructor(private manager: Manager) {}

    static toManagerLabels(labels: Label[]) {
        return _.map(labels, ({ key, value }) => ({ [key]: value }));
    }

    doGet(deployment: { id: string }, params: any) {
        return this.manager.doGet(`/deployments/${deployment.id}`, { params });
    }

    doGetDeployments<IncludeKeys extends keyof Deployment = keyof Deployment>(params: any) {
        return this.manager.doGet<PaginatedResponse<Pick<Deployment, IncludeKeys>>>('/deployments', { params });
    }

    doDelete(deployment: { id: string }) {
        return this.manager.doDelete(`/deployments/${deployment.id}`);
    }

    doForceDelete(deployment: { id: string }) {
        return this.manager.doDelete(`/deployments/${deployment.id}`, { params: { force: 'true' } });
    }

    // eslint-disable-next-line camelcase
    doCancel(execution: { id: string; deployment_id: string }, action: string) {
        return this.manager.doPost(`/executions/${execution.id}`, {
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
        return this.manager.doPost('/executions', {
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

    // TODO: Refactor to use options object
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
        skipHeal: boolean,
        skipDriftCheck: boolean,
        forceUpdate: boolean,
        preview: boolean
    ) {
        const body: Record<string, any> = {};

        if (!blueprintName) {
            body.blueprint_id = null;
        } else {
            body.blueprint_id = blueprintName;
            if (!_.isEmpty(deploymentInputs)) {
                body.inputs = deploymentInputs;
            }
        }

        body.skip_install = !shouldRunInstallWorkflow;
        body.skip_uninstall = !shouldRunUninstallWorkflow;
        body.install_first = installWorkflowFirst;
        body.ignore_failure = ignoreFailure;
        body.skip_reinstall = !shouldRunReinstall;
        body.reinstall_list = reinstallList;
        body.skip_heal = skipHeal;
        body.skip_drift_check = skipDriftCheck;
        body.force = forceUpdate;
        body.preview = preview;

        return this.manager.doPost(`/deployment-updates/${deploymentName}/update/initiate`, { body });
    }

    doSetVisibility(deploymentId: string, visibility: Visibility) {
        return this.manager.doPatch(`/deployments/${deploymentId}/set-visibility`, { body: { visibility } });
    }

    doSetSite(deploymentId: string, siteName: string, detachSite: any) {
        const body = detachSite ? { detach_site: detachSite } : { site_name: siteName };

        return this.manager.doPost(`/deployments/${deploymentId}/set-site`, { body });
    }

    doGetSiteName(deploymentId: string) {
        return this.manager
            .doGet(`/deployments/${deploymentId}?_include=site_name`)
            .then(({ site_name: siteName }) => siteName);
    }

    private doGetSites(include: string, params: Record<string, any> = {}) {
        return this.manager.doGet('/sites', {
            params: {
                _include: include,
                _get_all_results: true,
                ...params
            }
        });
    }

    doGetSitesNames(): Promise<Stage.Types.PaginatedResponse<Pick<Site, 'name'>>> {
        return this.doGetSites('name', { _sort: 'name' });
    }

    doGetSitesNamesAndLocations(): Promise<Stage.Types.PaginatedResponse<Site>> {
        return this.doGetSites('name,latitude,longitude');
    }

    doSetLabels(deploymentId: string, deploymentLabels: Label[]) {
        const labels = DeploymentActions.toManagerLabels(deploymentLabels);
        return this.manager.doPatch(`/deployments/${deploymentId}`, { body: { labels } });
    }

    doGetLabel(key: string, value: string) {
        return this.manager.doGet(`/labels/deployments/${key}?_search=${value}`);
    }

    doGetLabels(deploymentId: string) {
        return this.manager.doGet(`/deployments/${deploymentId}?_include=labels`).then(({ labels }) => labels);
    }

    doGetReservedLabelKeys() {
        return this.manager.doGet('/labels/deployments?_reserved=true').then(({ items }) => items);
    }

    doGetWorkflowsAndLabels(
        deploymentId: string
        // eslint-disable-next-line camelcase
    ): Promise<{ id: string; display_name: string; workflows: Workflow[]; labels: Label[] }> {
        return this.manager.doGet(`/deployments/${deploymentId}?_include=id,display_name,workflows,labels`);
    }

    async waitUntilCreated(deploymentId: string) {
        const executionActions = new ExecutionActions(this.manager);
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
