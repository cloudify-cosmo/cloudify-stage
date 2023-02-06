import { isEmpty, reject } from 'lodash';
import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { Agent, InstallMethod } from 'widgets/agents/src/types';
import { installMethodsOptions } from './consts';
import type { AgentsTableData } from './AgentsTable';
import AgentsTable from './AgentsTable';
import { translate, translateColumn } from './utils';

const translateConfiguration = Stage.Utils.composeT(translate, 'configuration');

interface AgentsParams {
    /* eslint-disable camelcase */
    deployment_id?: Stage.ContextEntries['deploymentId'];
    node_ids: Stage.ContextEntries['nodeId'];
    node_instance_ids: Stage.ContextEntries['nodeInstanceId'];
    install_methods?: InstallMethod[];
    /* eslint-enable camelcase */
    state: string;
}

export interface AgentsConfiguration extends DataTableConfiguration {
    fieldsToShow: string[];
    installMethods: InstallMethod[];
}

type AgentsData = Stage.Types.PaginatedResponse<Agent>;

Stage.defineWidget<AgentsParams, AgentsData, AgentsConfiguration>({
    id: 'agents',
    name: translate('name'),
    description: translate('description'),
    initialWidth: 12,
    initialHeight: 24,
    fetchUrl: '[manager]/agents?[params:gridParams,deployment_id,node_ids,node_instance_ids,install_methods,state]',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('agents'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(15),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('id'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true),
        {
            id: 'fieldsToShow',
            name: translateConfiguration('fieldsToShow.label'),
            description: translateConfiguration('fieldsToShow.description'),
            placeHolder: translateConfiguration('fieldsToShow.placeholder'),
            items: [
                translateColumn('id'),
                translateColumn('node'),
                translateColumn('deployment'),
                translateColumn('ip'),
                translateColumn('installMethod'),
                translateColumn('system'),
                translateColumn('version'),
                translateColumn('actions')
            ],
            default: `${translateColumn('id')},${translateColumn('node')},${translateColumn(
                'deployment'
            )},${translateColumn('installMethod')},${translateColumn('system')},${translateColumn(
                'version'
            )},${translateColumn('actions')}`,
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'installMethods',
            name: translateConfiguration('installMethods.label'),
            description: translateConfiguration('installMethods.description'),
            placeHolder: translateConfiguration('installMethods.placeholder'),
            items: installMethodsOptions,
            default: [],
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        }
    ],

    fetchParams(widget, toolbox) {
        const agentStartedState = 'started';

        return {
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            node_ids: toolbox.getContext().getValue('nodeId'),
            node_instance_ids: toolbox.getContext().getValue('nodeInstanceId'),
            install_methods: !isEmpty(widget.configuration.installMethods)
                ? reject(widget.configuration.installMethods, isEmpty)
                : undefined,
            state: agentStartedState
        };
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const params = this.fetchParams!(widget, toolbox);
        const formattedData: AgentsTableData = {
            items: data.items,
            total: data.metadata.pagination.total,
            deploymentId: params.deployment_id || null,
            nodeId: params.node_ids,
            nodeInstanceId: params.node_instance_ids
        };

        return <AgentsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
