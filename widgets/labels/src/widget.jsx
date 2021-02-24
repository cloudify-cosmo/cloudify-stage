import LabelsTable from './LabelsTable';

Stage.defineWidget({
    id: 'labels',
    name: 'Labels',
    description: 'This widget shows a list of defined labels',
    initialWidth: 12,
    initialHeight: 24,
    color: 'olive',
    isReact: true,
    hasStyle: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('labels'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    fetchParams() {
        return {};
    },

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        if (deploymentId) {
            const { DeploymentActions } = Stage.Common;
            return new DeploymentActions(toolbox).doGetLabels(deploymentId);
        }
        return Promise.resolve([]);
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (!Array.isArray(data)) {
            return <Loading />;
        }

        const formattedData = {
            items: data.map(item => _.pick(item, 'key', 'value')),
            deploymentId: toolbox.getContext().getValue('deploymentId')
        };

        return <LabelsTable data={formattedData} toolbox={toolbox} />;
    }
});
