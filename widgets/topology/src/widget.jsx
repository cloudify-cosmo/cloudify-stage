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
                    .map('templateData.deploymentId')
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

        return DataFetcher.fetch(toolbox, blueprintId, deploymentId, true)
            .then(rawBlueprintData => {
                const processedBlueprintData = createBaseTopology(rawBlueprintData);
                const result = { processedBlueprintData, rawBlueprintData };
                if (deploymentId) {
                    return fetchComponentsDeploymentsData(processedBlueprintData).then(componentDeploymentsData => ({
                        componentDeploymentsData,
                        ...result
                    }));
                }
                return result;
            })
            .then(data => {
                const plugins = _(data.componentDeploymentsData)
                    .flatMap('nodes')
                    .concat(data.processedBlueprintData.nodes)
                    .flatMap('templateData.plugins')
                    .map(plugin => _.pick(plugin, 'package_name', 'package_version'))
                    .uniqWith(_.isEqual)
                    .filter(plugin => plugin.package_name && plugin.package_version)
                    .value();

                if (_.isEmpty(plugins)) return data;

                return toolbox
                    .getManager()
                    .doGet('/plugins?_include=id,package_name,package_version')
                    .then(pluginsData =>
                        Promise.all(
                            _.map(plugins, plugin => {
                                const pluginId = _.get(
                                    _.find(pluginsData.items, plugin) ||
                                        _.find(pluginsData.items, _.pick(plugin, 'package_name')),
                                    'id'
                                );

                                return toolbox
                                    .getInternal()
                                    .doGet(`/plugins/icons/${pluginId}`, null, false)
                                    .then(response => response.blob())
                                    .then(
                                        blob =>
                                            new Promise(resolve => {
                                                if (blob.size) {
                                                    const reader = new FileReader();
                                                    reader.addEventListener('error', () => resolve());
                                                    reader.addEventListener('load', () => {
                                                        resolve({ [plugin.package_name]: reader.result });
                                                    });
                                                    reader.readAsDataURL(blob);
                                                } else {
                                                    resolve();
                                                }
                                            })
                                    );
                            })
                        )
                    )
                    .then(icons => ({
                        ...data,
                        icons: _.reduce(icons, _.merge)
                    }));
            });
    },

    render(widget, data, error, toolbox) {
        const {
            processedBlueprintData: blueprintDeploymentData,
            componentDeploymentsData,
            rawBlueprintData: {
                data: { id },
                layout
            },
            icons
        } = _.isEmpty(data) ? { rawBlueprintData: { data: { id: '' }, layout: {} } } : data;

        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = deploymentId ? id : toolbox.getContext().getValue('blueprintId');
        const formattedData = {
            blueprintDeploymentData,
            componentDeploymentsData,
            layout,
            icons
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
