import { castArray } from 'lodash';
import DataFetcher from './DataFetcher';
import { createBaseTopology } from './DataProcessor';
import Topology from './Topology';
import type { StageTopologyData, TopologyWidget } from './widget.types';

const translate = Stage.Utils.getT('widgets.topology');
const translateConfiguration = Stage.Utils.composeT(translate, 'configuration');

Stage.defineWidget<TopologyWidget.Params, TopologyWidget.Data, TopologyWidget.Configuration>({
    id: 'topology',
    initialWidth: 8,
    initialHeight: 16,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('topology'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'enableNodeClick',
            name: translateConfiguration('enableNodeClick'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'enableGroupClick',
            name: translateConfiguration('enableGroupClick'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'enableZoom',
            name: translateConfiguration('enableZoom'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'enableDrag',
            name: translateConfiguration('enableDrag'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showToolbar',
            name: translateConfiguration('showToolbar'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchParams(_widget, toolbox) {
        // TODO(RD-2130): Use common utility function to get only the first ID
        const deploymentId = castArray(toolbox.getContext().getValue('deploymentId'))[0] ?? undefined;
        const blueprintId = castArray(toolbox.getContext().getValue('blueprintId'))[0];

        return {
            blueprintId,
            deploymentId
        };
    },

    fetchData(_widget, toolbox, params) {
        const { blueprintId, deploymentId } = params;

        function fetchComponentsDeploymentsData(
            rootDeploymentData?: StageTopologyData
        ): Promise<Record<string, StageTopologyData>> {
            return Promise.all(
                _(rootDeploymentData?.nodes)
                    .map('templateData.deploymentId')
                    .compact()
                    .map(depId =>
                        DataFetcher.fetch(toolbox, depId).then(componentDeploymentData => {
                            const processedNestedDeploymentData = createBaseTopology(componentDeploymentData);
                            return fetchComponentsDeploymentsData(processedNestedDeploymentData).then(
                                nestedDeploymentData => ({
                                    [depId]: processedNestedDeploymentData,
                                    ...nestedDeploymentData
                                })
                            );
                        })
                    )
                    .value()
            ).then(componentDeploymentsData => Object.assign({}, ...componentDeploymentsData));
        }

        return DataFetcher.fetch(toolbox, deploymentId, blueprintId, true)
            .then(rawBlueprintData => {
                const processedBlueprintData = createBaseTopology(rawBlueprintData);
                const result = { processedBlueprintData, rawBlueprintData, componentDeploymentsData: {} };
                if (deploymentId) {
                    return fetchComponentsDeploymentsData(processedBlueprintData).then(componentDeploymentsData => ({
                        ...result,
                        componentDeploymentsData
                    }));
                }
                return result;
            })
            .then(data => {
                const plugins = _(data.componentDeploymentsData)
                    .flatMap('nodes')
                    .concat(data.processedBlueprintData?.nodes)
                    .flatMap('templateData.plugins')
                    .map(plugin => _.pick(plugin, 'package_name', 'package_version'))
                    .uniqWith(_.isEqual)
                    .filter(plugin => plugin.package_name && plugin.package_version)
                    .value();

                if (_.isEmpty(plugins)) return { ...data, icons: {} };

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
                                    .doGet<Response>(`/plugins/icons/${pluginId}`, { parseResponse: false })
                                    .then(response => response.blob())
                                    .then(
                                        blob =>
                                            new Promise(resolve => {
                                                if (blob.size) {
                                                    const reader = new FileReader();
                                                    reader.addEventListener('error', () => resolve(undefined));
                                                    reader.addEventListener('load', () => {
                                                        resolve({ [plugin.package_name]: reader.result });
                                                    });
                                                    reader.readAsDataURL(blob);
                                                } else {
                                                    resolve(undefined);
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

    render(widget, data, _error, toolbox) {
        const blueprintDeploymentData = data?.processedBlueprintData;
        const componentDeploymentsData = data?.componentDeploymentsData ?? {};
        const id = data?.rawBlueprintData?.data?.id ?? '';
        const layout = data?.rawBlueprintData?.layout ?? {};
        const icons = data?.icons ?? {};

        // TODO(RD-2130): Use common utility function to get only the first ID
        const deploymentId = castArray(toolbox.getContext().getValue('deploymentId'))[0];
        const blueprintId = deploymentId ? id : castArray(toolbox.getContext().getValue('blueprintId'))[0];

        const formattedData = {
            blueprintDeploymentData,
            componentDeploymentsData,
            layout,
            icons
        };

        return (
            <Topology
                blueprintId={blueprintId}
                deploymentId={deploymentId ?? undefined}
                configuration={widget.configuration}
                data={formattedData}
                toolbox={toolbox}
            />
        );
    }
});
