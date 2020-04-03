/**
 * Created by kinneretzin on 07/09/2016.
 */

import Topology from './Topology';
import DataFetcher from './DataFetcher';
import { createBaseTopology } from './DataProcessor';

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
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'enableGroupClick',
            name: 'Enable group click',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        { id: 'enableZoom', name: 'Enable zoom', default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE },
        { id: 'enableDrag', name: 'Enable drag', default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE },
        { id: 'showToolbar', name: 'Show toolbar', default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE }
    ],

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        function fetchComponentsDeployemntsData(rootDeploymentData) {
            return Promise.all(
                _(rootDeploymentData.nodes)
                    .map('templateData')
                    .filter({ actual_number_of_instances: 1 })
                    .map(templateData =>
                        _(templateData.deploymentSettings)
                            .map('id')
                            .compact()
                            .head()
                    )
                    .compact()
                    .map(depId =>
                        DataFetcher.fetch(toolbox, null, depId, false).then(componentDeploymentData => {
                            const processedNestedDeploymentData = createBaseTopology(componentDeploymentData);
                            return fetchComponentsDeployemntsData(processedNestedDeploymentData).then(
                                nestedDeploymentData => ({
                                    [depId]: processedNestedDeploymentData,
                                    ...nestedDeploymentData
                                })
                            );
                        })
                    )
            ).then(componentDeployemntsData => _.merge(...componentDeployemntsData));
        }

        return DataFetcher.fetch(toolbox, blueprintId, deploymentId, true).then(rawBlueprintData => {
            const processedBlueprintData = createBaseTopology(rawBlueprintData);
            const result = { processedBlueprintData, rawBlueprintData };
            if (deploymentId) {
                return fetchComponentsDeployemntsData(processedBlueprintData).then(componentDeployemntsData => ({
                    componentDeployemntsData,
                    ...result
                }));
            }
            return result;
        });
    },

    render(widget, data = {}, error, toolbox) {
        const topologyConfig = {
            enableNodeClick: widget.configuration.enableNodeClick,
            enableGroupClick: widget.configuration.enableGroupClick,
            enableZoom: widget.configuration.enableZoom,
            enableDrag: widget.configuration.enableDrag,
            showToolbar: widget.configuration.showToolbar
        };

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        const { rawBlueprintData } = data;
        const formattedData = {
            blueprintDeploymentData: data.processedBlueprintData,
            componentDeployemntsData: data.componentDeployemntsData,
            layout: _.get(rawBlueprintData, 'layout'),
            deploymentId,
            blueprintId: blueprintId || _.get(rawBlueprintData, 'data.id'),
            topologyConfig
        };

        return <Topology widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
