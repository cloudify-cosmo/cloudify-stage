import OutputsTable from './OutputsTable';

Stage.defineWidget({
    id: "outputs",
    name: "Deployment Outputs",
    description: 'This widget shows the deployment outputs',
    initialWidth: 8,
    initialHeight: 20,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2)
    ],

    fetchData: function(widget,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');
        let blueprintId = toolbox.getContext().getValue('blueprintId');
        let _stringify = this._stringify;

        if (deploymentId) {
            let deploymentOutputsPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}/outputs`);
            let deploymentPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=outputs`);

            return Promise.all([deploymentOutputsPromise, deploymentPromise])
                          .then(data => {
                let deploymentOutputs = _.get(data[0], 'outputs', {});
                let deployment = _.get(data[1], 'outputs', {});
                return Promise.resolve({
                    outputs: _.map(deployment, (outputObject, outputName) => (
                        {
                            name: outputName,
                            value: deploymentOutputs[outputName],
                            description: outputObject.description || ''
                        })
                    )
                });
            });
        }

        if (blueprintId) {
            return toolbox.getManager().doGet(`/blueprints/${blueprintId}?_include=plan`)
                .then(data => {
                    let blueprintOutputs = _.get(data, 'plan.outputs', {});
                    return Promise.resolve({
                        outputs: _.map(blueprintOutputs, (outputObject, outputName) => (
                            {
                                name: outputName,
                                value: outputObject.value,
                                description: outputObject.description || ''
                            })
                        )
                    })
                })
        };

        return Promise.resolve({outputs:[]});
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let formattedData = Object.assign({}, {
            items: data.outputs,
            deploymentId: toolbox.getContext().getValue('deploymentId'),
            blueprintId: toolbox.getContext().getValue('blueprintId')
        });

        return (
            <OutputsTable data={formattedData} toolbox={toolbox} widget={widget}/>
        );
    }
});