/**
 * Created by jakub.niezgoda on 04/10/2018.
 */

import AgentsTable from './AgentsTable';
import Consts from './consts';

Stage.defineWidget({
    id: 'agents',
    name: 'Agents',
    description: 'This widget shows list of installed agents',
    initialWidth: 12,
    initialHeight: 24,
    color : 'olive',
    fetchUrl: '[manager]/agents?[params:deployment_id,node_ids,node_instance_ids,install_methods]',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,//Stage.GenericConfig.WIDGET_PERMISSION('agents'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    
    initialConfiguration:
        [
            Stage.GenericConfig.POLLING_TIME_CONFIG(15),
            {
                id: 'fieldsToShow', name: 'List of fields to show in the table',
                description: 'Some of the fields may be hidden depending on the context, ' +
                             'eg. when Deployment ID is set in context then Deployment field will be hidden.',
                placeHolder: 'Select fields from the list',
                items: ['Id','Node','Deployment','IP','Install Method','System','Version','Actions'],
                default: 'Id,Node,Deployment,IP,Install Method,System,Version,Actions', 
                type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
            },
            {
                id: 'installMethods', name: 'Filter Agents by Install Method',
                description: 'Choose Install Methods to filter Agents. Unset all options to disable this type of filtering.',
                placeHolder: 'Select Install Methods from the list',
                items: Consts.installMethodsOptions,
                default: '',
                type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
            }
        ],

    fetchParams: function(widget, toolbox) {
        return {
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            node_ids: toolbox.getContext().getValue('nodeId'),
            node_instance_ids: toolbox.getContext().getValue('nodeInstanceId'),
            install_methods: !_.isEmpty(widget.configuration.installMethods)
                ? _.reject(widget.configuration.installMethods, _.isEmpty)
                : undefined
        };
    },

    render: function(widget, data, error, toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let selectedAgent = toolbox.getContext().getValue('agentId');
        let params = this.fetchParams(widget, toolbox);
        let formattedData = {
            items: _.map(data.items, (item) => ({...item, isSelected: item.id === selectedAgent})),
            total: _.get(data, 'metadata.pagination.total', 0),
            deploymentId: params.deployment_id,
            nodeId: params.node_ids,
            nodeInstanceId: params.node_instance_ids
        };

        return (
            <AgentsTable configuration={widget.configuration} data={formattedData} toolbox={toolbox} />
        );
    }
});
