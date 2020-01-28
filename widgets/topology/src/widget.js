/**
 * Created by kinneretzin on 07/09/2016.
 */

import Topology from './Topology';
import DataFetcher from './DataFetcher';

Stage.defineWidget({
    id: 'topology',
    name: 'Topology',
    description: 'Shows topology (blueprint or deployment)',
    initialWidth: 8,
    initialHeight: 16,
    color: 'yellow',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('topology'),
    hasStyle: true,
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'enableNodeClick',
            name: 'Enable node click',
            default: true,
            type: Stage.Shared.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'enableGroupClick',
            name: 'Enable group click',
            default: true,
            type: Stage.Shared.GenericField.BOOLEAN_TYPE
        },
        { id: 'enableZoom', name: 'Enable zoom', default: true, type: Stage.Shared.GenericField.BOOLEAN_TYPE },
        { id: 'enableDrag', name: 'Enable drag', default: true, type: Stage.Shared.GenericField.BOOLEAN_TYPE },
        { id: 'showToolbar', name: 'Show toolbar', default: true, type: Stage.Shared.GenericField.BOOLEAN_TYPE }
    ],

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');
        const expandedDeployments = [DataFetcher.fetch(toolbox, blueprintId, deploymentId)];

        const deploymentsToFetch = toolbox.getContext().getValue('deploymentsToExpand');
        _.each(deploymentsToFetch, dep => {
            expandedDeployments.push(DataFetcher.fetch(toolbox, null, dep));
        });

        return Promise.all(expandedDeployments);
    },

    render(widget, data, error, toolbox) {
        const topologyConfig = {
            enableNodeClick: widget.configuration.enableNodeClick,
            enableGroupClick: widget.configuration.enableGroupClick,
            enableZoom: widget.configuration.enableZoom,
            enableDrag: widget.configuration.enableDrag,
            showToolbar: widget.configuration.showToolbar
        };

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');
        const expandedDeployments = toolbox.getContext().getValue('deploymentsToExpand');

        const deploymentsData = { ...data };
        const formattedData = { deploymentsData, deploymentId, blueprintId, topologyConfig, expandedDeployments };

        return <Topology widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
