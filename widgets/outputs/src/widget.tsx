import { castArray } from 'lodash';
import type { OutputsTableProps } from './OutputsTable';
import OutputsTable from './OutputsTable';
import type { OutputsAndCapabilitiesItem, OutputsWidgetConfiguration } from './types';

interface Data {
    outputsAndCapabilities: OutputsAndCapabilitiesItem[];
}

Stage.defineWidget<unknown, Data, OutputsWidgetConfiguration>({
    id: 'outputs',
    initialWidth: 8,
    initialHeight: 20,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('outputs'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showCapabilities',
            name: 'Show Capabilities',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        function createEntity(
            name: string,
            value: unknown,
            object: Record<string, string>,
            isOutput: boolean
        ): OutputsAndCapabilitiesItem {
            return {
                name,
                value,
                description: object.description || '',
                isOutput
            };
        }

        function createOutput(name: string, value: unknown, object: Record<string, string>) {
            return createEntity(name, value, object, true);
        }

        function createCapability(name: string, value: unknown, object: Record<string, string>) {
            return createEntity(name, value, object, false);
        }

        if (deploymentId) {
            const deploymentOutputsPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}/outputs`);
            const deploymentCapabilitiesPromise = widget.configuration.showCapabilities
                ? toolbox.getManager().doGet(`/deployments/${deploymentId}/capabilities`)
                : Promise.resolve({});
            const deploymentPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}`, {
                params: {
                    _include: widget.configuration.showCapabilities ? 'outputs,capabilities' : 'outputs'
                }
            });

            return Promise.all([deploymentOutputsPromise, deploymentCapabilitiesPromise, deploymentPromise]).then(
                data => {
                    const deploymentOutputs = _.get(data[0], 'outputs', {});
                    const deploymentCapabilities = _.get(data[1], 'capabilities', {});
                    const outputs = _.get(data[2], 'outputs', {});
                    const capabilities = _.get(data[2], 'capabilities', {});

                    return Promise.resolve({
                        outputsAndCapabilities: [
                            ..._.map(outputs, (outputObject, outputName) =>
                                createOutput(outputName, deploymentOutputs[outputName], outputObject)
                            ),
                            ..._.map(capabilities, (capabilityObject, capabilityName) =>
                                createCapability(
                                    capabilityName,
                                    deploymentCapabilities[capabilityName],
                                    capabilityObject
                                )
                            )
                        ]
                    });
                }
            );
        }

        if (blueprintId) {
            return toolbox
                .getManager()
                .doGet(`/blueprints/${blueprintId}?_include=plan`)
                .then(data => {
                    const blueprintOutputs = _.get(data, 'plan.outputs', {});
                    const blueprintCapabilities = widget.configuration.showCapabilities
                        ? _.get(data, 'plan.capabilities', {})
                        : {};

                    return Promise.resolve({
                        outputsAndCapabilities: [
                            ..._.map(blueprintOutputs, (outputObject, outputName) =>
                                createOutput(outputName, outputObject.value, outputObject)
                            ),
                            ..._.map(blueprintCapabilities, (capabilityObject, capabilityName) =>
                                createCapability(capabilityName, capabilityObject.value, capabilityObject)
                            )
                        ]
                    });
                });
        }

        return Promise.resolve({ outputsAndCapabilities: [] });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data) || !data) {
            return <Loading />;
        }

        const formattedData: OutputsTableProps['data'] = {
            outputsAndCapabilities: data.outputsAndCapabilities,
            deploymentId: castArray(toolbox.getContext().getValue('deploymentId'))[0],
            blueprintId: toolbox.getContext().getValue('blueprintId')
        };

        return <OutputsTable data={formattedData} toolbox={toolbox} widget={widget} />;
    }
});
