import OutputsTable from './OutputsTable';

Stage.defineWidget({
    id: 'outputs',
    name: 'Deployment Outputs/Capabilities',
    description: 'This widget shows the deployment outputs and capabilities',
    initialWidth: 8,
    initialHeight: 20,
    color: 'blue',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('outputs'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showCapabilities',
            name: 'Show Capabilities',
            default: true,
            type: Stage.Shared.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        if (deploymentId) {
            const deploymentOutputsPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}/outputs`);
            const deploymentCapabilitiesPromise = widget.configuration.showCapabilities
                ? toolbox.getManager().doGet(`/deployments/${deploymentId}/capabilities`)
                : Promise.resolve({});
            const deploymentPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}`, {
                _include: widget.configuration.showCapabilities ? 'outputs,capabilities' : 'outputs'
            });

            return Promise.all([deploymentOutputsPromise, deploymentCapabilitiesPromise, deploymentPromise]).then(
                data => {
                    const deploymentOutputs = _.get(data[0], 'outputs', {});
                    const deploymentCapabilities = _.get(data[1], 'capabilities', {});
                    const outputs = _.get(data[2], 'outputs', {});
                    const capabilities = _.get(data[2], 'capabilities', {});

                    return Promise.resolve({
                        outputsAndCapabilities: [
                            ..._.map(outputs, (outputObject, outputName) => ({
                                name: outputName,
                                value: deploymentOutputs[outputName],
                                description: outputObject.description || '',
                                isCapability: false
                            })),
                            ..._.map(capabilities, (capabilityObject, capabilityName) => ({
                                name: capabilityName,
                                value: deploymentCapabilities[capabilityName],
                                description: capabilityObject.description || '',
                                isCapability: true
                            }))
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
                            ..._.map(blueprintOutputs, (outputObject, outputName) => ({
                                name: outputName,
                                value: outputObject.value,
                                description: outputObject.description || '',
                                isCapability: false
                            })),
                            ..._.map(blueprintCapabilities, (capabilityObject, capabilityName) => ({
                                name: capabilityName,
                                value: capabilityObject.value,
                                description: capabilityObject.description || '',
                                isCapability: true
                            }))
                        ]
                    });
                });
        }

        return Promise.resolve({ outputsAndCapabilities: [] });
    },

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        const formattedData = {
            outputsAndCapabilities: data.outputsAndCapabilities,
            deploymentId: toolbox.getContext().getValue('deploymentId'),
            blueprintId: toolbox.getContext().getValue('blueprintId')
        };

        return <OutputsTable data={formattedData} toolbox={toolbox} widget={widget} />;
    }
});
