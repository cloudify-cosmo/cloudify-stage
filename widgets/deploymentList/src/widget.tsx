import DeploymentList from './DeploymentList';
import type { DeploymentListWidget, DeploymentsTableDataType } from './types';

type DeploymentLabelType = {
    key: string;
    value: string;
};

type DeploymentDataItem =
    | {
          id: string;
          // eslint-disable-next-line camelcase
          display_name: string;
          // eslint-disable-next-line camelcase
          blueprint_id: string;
          labels: DeploymentLabelType[];
      }
    | Record<string, any>;

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
    hasStyle: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchData(_widget, toolbox, params): Promise<DeploymentsTableDataType> {
        const deploymentDataPromise = toolbox.getManager().doGet(`/deployments`, {
            params: {
                _include: 'id,display_name,blueprint_id,labels',
                ...params
            }
        });

        return deploymentDataPromise.then(function mapDataFetchedToTable(
            data: DeploymentDataType
        ): DeploymentsTableDataType {
            return {
                // eslint-disable-next camelcase
                items: data.items.map(({ id, display_name: displayName, blueprint_id: blueprintId, labels }) => ({
                    id,
                    displayName,
                    blueprintId,
                    label: labels.find((label: DeploymentLabelType) => label.key === 'status')?.value
                })),
                total: _.get(data, 'metadata.pagination.total', 0)
            };
        });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <DeploymentList widget={widget} data={data} toolbox={toolbox} />;
    }
});
