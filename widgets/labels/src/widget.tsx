import { castArray } from 'lodash';
import LabelsTable from './LabelsTable';
import './widget.css';

const { i18n } = Stage;

Stage.defineWidget<{ deploymentId: string | null }, unknown, unknown>({
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
    fetchParams(_widget, toolbox) {
        // TODO(RD-2130): Use common utility function to get only the first ID
        const deploymentId = castArray(toolbox.getContext().getValue('deploymentId'))[0];

        return {
            deploymentId
        };
    },

    fetchData(_widget, toolbox, params) {
        const { deploymentId } = params;
        if (deploymentId) {
            const DeploymentActions = Stage.Common.Deployments.Actions;
            return new DeploymentActions(toolbox.getManager()).doGetLabels(deploymentId);
        }
        return Promise.resolve([]);
    },

    render(_widget, data, _error, toolbox) {
        // TODO(RD-2130): Use common utility function to get only the first ID
        const deploymentId = castArray(toolbox.getContext().getValue('deploymentId'))[0];

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
