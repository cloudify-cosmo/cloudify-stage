// @ts-nocheck File not migrated fully to TS

import AgentsTable from './AgentsTable';
import Consts from './consts';

const t = Stage.Utils.getT('widgets.agents');

Stage.defineWidget({
    id: 'agents',
    name: 'Agents',
    description: 'This widget shows list of installed agents',
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
            name: 'List of fields to show in the table',
            description:
                'Some of the fields may be hidden depending on the context, ' +
                'eg. when Deployment ID is set in context then Deployment field will be hidden.',
            placeHolder: 'Select fields from the list',
            items: [
                t('columns.id'),
                t('columns.node'),
                t('columns.deployment'),
                t('columns.ip'),
                t('columns.installMethod'),
                t('columns.system'),
                t('columns.version'),
                t('columns.actions')
            ],
            default: `${t('columns.id')},${t('columns.node')},${t('columns.deployment')},${t(
                'columns.installMethod'
            )},${t('columns.system')},${t('columns.version')},${t('columns.actions')}`,
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'installMethods',
            name: 'Filter Agents by Install Method',
            description:
                'Choose Install Methods to filter Agents. Unset all options to disable this type of filtering.',
            placeHolder: 'Select Install Methods from the list',
            items: Consts.installMethodsOptions,
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
            install_methods: !_.isEmpty(widget.configuration.installMethods)
                ? _.reject(widget.configuration.installMethods, _.isEmpty)
                : undefined,
            state: agentStartedState
        };
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const params = this.fetchParams(widget, toolbox);
        const formattedData = {
            items: data.items,
            total: _.get(data, 'metadata.pagination.total', 0),
            deploymentId: params.deployment_id,
            nodeId: params.node_ids,
            nodeInstanceId: params.node_instance_ids
        };

        return <AgentsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
