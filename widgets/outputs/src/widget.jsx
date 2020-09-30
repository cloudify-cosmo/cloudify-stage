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
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        function createEntity(name, value, object, isOutput) {
            return {
                name,
                value,
                description: object.description || '',
                isOutput
            };
        }

        function createOutput(name, value, object) {
            return createEntity(name, value, object, true);
        }

        function createCapability(name, value, object) {
            return createEntity(name, value, object, false);
        }

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

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const formattedData = {
            outputsAndCapabilities: data.outputsAndCapabilities,
            deploymentId: toolbox.getContext().getValue('deploymentId'),
            blueprintId: toolbox.getContext().getValue('blueprintId')
        };

        return <OutputsTable data={formattedData} toolbox={toolbox} widget={widget} />;
    }
});
