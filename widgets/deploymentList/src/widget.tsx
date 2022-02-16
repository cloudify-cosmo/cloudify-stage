import DeploymentsList from './DeploymentsList';

import type DeploymentsTableDataType from './types/DeploymentsTableDataType';
import type { DeploymentListWidget } from './types/DeploymentList';

type DeploymentLabelType = {
    key: string;
    value: string;
};

type DeploymentDataItem = {
    id: string,
    display_name: string,
    blueprint_id: string,
    labels: DeploymentLabelType[]
} | Record<string, any>;

type DeploymentDataType = {
    items: DeploymentDataItem[];
    metadata: any;
};

Stage.defineWidget<any, any, DeploymentListWidget.Configuration>({
    id: 'deploymentList',
    name: 'Deployment list',
    description: 'The widget displays deployment list',
    initialWidth: 12,
    initialHeight: 20,
    color: 'green',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(10),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('id'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    isReact: true,
    hasReadme: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchData(_widget, toolbox, params) : Promise<DeploymentsTableDataType> {
        const deploymentDataPromise = new Stage.Common.DeploymentActions(toolbox).doGetDeployments({
            _include:
                'id,display_name,blueprint_id,labels',
            ...params
        });

        return deploymentDataPromise
            .then(function mapDataFetchedToTable(data: DeploymentDataType): DeploymentsTableDataType {
                return {
                    items: data.items.map(({id, display_name, blueprint_id, labels}) => ({
                        id,
                        display_name,
                        blueprint_id,
                        label: labels.find(
                            (label: DeploymentLabelType) => label.key === 'system'
                        )?.value
                    })),
                    total: _.get(data, 'metadata.pagination.total', 0)
                }
            });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <DeploymentsList widget={widget} data={data} toolbox={toolbox} />;
    }
});
