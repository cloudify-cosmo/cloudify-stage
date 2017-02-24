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

        if (deploymentId) {
            return toolbox.getManager().doGet(`/deployments/${deploymentId}/outputs`)
                .then(data=>Promise.resolve({outputs: _.get(data, 'outputs', {})}));
        }
        return Promise.resolve({outputs:{}});
    },

    _stringifyOutputs: function(outputs) {
        return _.map(outputs, (value, key) => {
            let stringifiedValue = '';
            try {
                stringifiedValue = JSON.stringify(value);
            } catch (e) {
                console.error(`Cannot parse output value for '${key}'. `, e);
            }
            return ({id: key, value: stringifiedValue});
        });
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }
        let outputs = this._stringifyOutputs(data.outputs);
        let formattedData = Object.assign({}, {
            items: outputs,
            deploymentId: toolbox.getContext().getValue('deploymentId'),
            total: outputs.length
        });

        return (
            <OutputsTable data={formattedData} toolbox={toolbox} widget={widget}/>
        );
    }
});