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

    fetchParams(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        return {
            blueprintId,
            deploymentId
        };
    },

    fetchData(widget, toolbox, params) {
        const { blueprintId, deploymentId } = params;

        function fetchComponentsDeploymentsData(rootDeploymentData) {
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
                            return fetchComponentsDeploymentsData(processedNestedDeploymentData).then(
                                nestedDeploymentData => ({
                                    [depId]: processedNestedDeploymentData,
                                    ...nestedDeploymentData
                                })
                            );
                        })
                    )
            ).then(componentDeploymentsData => _.merge(...componentDeploymentsData));
        }

        return DataFetcher.fetch(toolbox, blueprintId, deploymentId, true).then(rawBlueprintData => {
            const processedBlueprintData = createBaseTopology(rawBlueprintData);
            const result = { processedBlueprintData, rawBlueprintData };
            if (deploymentId) {
                return fetchComponentsDeploymentsData(processedBlueprintData).then(componentDeploymentsData => ({
                    componentDeploymentsData,
                    ...result
                }));
            }
            return result;
        });
    },

    render(widget, data, error, toolbox) {
        const {
            processedBlueprintData: blueprintDeploymentData,
            componentDeploymentsData,
            rawBlueprintData: {
                data: { id },
                layout
            }
        } = _.isEmpty(data) ? { rawBlueprintData: { data: { id: '' }, layout: {} } } : data;

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = deploymentId ? id : toolbox.getContext().getValue('blueprintId');
        const formattedData = {
            blueprintDeploymentData,
            componentDeploymentsData,
            layout
        };

        return (
            <Topology
                blueprintId={blueprintId}
                deploymentId={deploymentId}
                configuration={widget.configuration}
                data={formattedData}
                toolbox={toolbox}
            />
        );
    }
});
