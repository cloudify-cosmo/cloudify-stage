import type { Label } from '../../common/src/labels/types';
import LabelsTable from './LabelsTable';
import './widget.css';

const { i18n } = Stage;

export type LabelsData = {
    deploymentId: string;
    labels: Label[];
};

Stage.defineWidget({
    id: 'labels',
    name: i18n.t('widgets.labels.name'),
    description: i18n.t('widgets.labels.description'),
    initialWidth: 12,
    initialHeight: 24,
    color: 'olive',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('labels'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30)],

    // ensures data refetch on deploymentId change
    fetchParams(_widget, toolbox) {
        return {
            deploymentId: toolbox.getContext().getValue('deploymentId')
        };
    },

    fetchData(
        _widget,
        toolbox,
        params: {
            deploymentId: string | string[] | null | undefined;
        }
    ) {
        const { deploymentId } = params;
        if (deploymentId) {
            const DeploymentActions = Stage.Common.Deployments.Actions;
            return new DeploymentActions(toolbox).doGetLabels(deploymentId as string);
        }
        return Promise.resolve([]);
    },

    render(_widget, data, _error, toolbox) {
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
        const formattedData: LabelsData = {
            labels: Labels.sortLabels(_.map(data, item => _.pick(item, 'key', 'value'))),
            deploymentId: deploymentId as string
        };

        return <LabelsTable data={formattedData} toolbox={toolbox} />;
    }
});
