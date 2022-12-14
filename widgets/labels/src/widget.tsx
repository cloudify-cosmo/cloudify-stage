// @ts-nocheck File not migrated fully to TS
import LabelsTable from './LabelsTable';
import './widget.css';

const { i18n } = Stage;

Stage.defineWidget({
    id: 'labels',
    name: i18n.t('widgets.labels.name'),
    description: i18n.t('widgets.labels.description'),
    initialWidth: 12,
    initialHeight: 24,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('labels'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30)],

    // ensures data refetch on deploymentId change
    fetchParams(widget, toolbox) {
        return {
            deploymentId: toolbox.getContext().getValue('deploymentId')
        };
    },

    fetchData(widget, toolbox, params) {
        const { deploymentId } = params;
        if (deploymentId) {
            const DeploymentActions = Stage.Common.Deployments.Actions;
            return new DeploymentActions(toolbox.getManager()).doGetLabels(deploymentId);
        }
        return Promise.resolve([]);
    },

    render(widget, data, error, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        if (!deploymentId) {
            const { Message } = Stage.Basic;
            return <Message info>{i18n.t('widgets.labels.noDeployment')}</Message>;
        }

        if (!Array.isArray(data)) {
            const { Loading } = Stage.Basic;
            return <Loading />;
        }

        const { Labels } = Stage.Common;
        const formattedData = {
            labels: Labels.sortLabels(_.map(data, item => _.pick(item, 'key', 'value'))),
            deploymentId
        };

        return <LabelsTable data={formattedData} toolbox={toolbox} />;
    }
});
