import LabelsTable from './LabelsTable';

const { i18n } = Stage;

Stage.defineWidget({
    id: 'labels',
    name: i18n.t('widgets.labels.name'),
    description: i18n.t('widgets.labels.description'),
    initialWidth: 12,
    initialHeight: 24,
    color: 'olive',
    isReact: true,
    hasStyle: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('labels'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    // ensures data refetch on deploymentId change
    fetchParams(widget, toolbox) {
        return {
            deploymentId: toolbox.getContext().getValue('deploymentId')
        };
    },

    fetchData(widget, toolbox, params) {
        const { deploymentId } = params;
        if (deploymentId) {
            const { DeploymentActions } = Stage.Common;
            return new DeploymentActions(toolbox).doGetLabels(deploymentId);
        }
        return Promise.resolve([]);
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        if (!deploymentId) {
            const { Message } = Stage.Basic;
            return <Message info>{i18n.t('widgets.labels.noDeployment')}</Message>;
        }

        if (!Array.isArray(data)) {
            return <Loading />;
        }

        const formattedData = {
            labels: _(data)
                .map(item => _.pick(item, 'key', 'value'))
                .sortBy('key')
                .value(),
            deploymentId
        };

        return <LabelsTable data={formattedData} toolbox={toolbox} />;
    }
});
