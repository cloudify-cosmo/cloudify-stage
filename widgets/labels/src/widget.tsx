import { castArray } from 'lodash';
import type { PollingTimeConfiguration } from 'app/utils/GenericConfig';
import type { Label } from 'app/widgets/common/labels/types';
import LabelsTable from './LabelsTable';
import './widget.css';

const translate = Stage.Utils.getT('widgets.labels');

Stage.defineWidget<{ deploymentId: string | null }, Label[], PollingTimeConfiguration>({
    id: 'labels',
    name: translate('name'),
    description: translate('description'),
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
            return <Message info>{translate('noDeployment')}</Message>;
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
