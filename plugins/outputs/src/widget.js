import OutputsTable from './OutputsTable';

Stage.addPlugin({
    id: "outputs",
    name: "Deployment Outputs",
    description: 'This plugin shows the deployment outputs',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 2}
    ],

    fetchData: function(plugin,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');

        if (deploymentId) {
            return toolbox.getManager().doGet(`/deployments?_include=id,outputs&id=${deploymentId}`)
                .then(data=>Promise.resolve({outputs: _.get(data, "items[0].outputs", {})}));
        }
        return Promise.resolve({outputs:{}});
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let formattedData = Object.assign({},data,{
            items: Object.keys(data.outputs).map(function(key) {
                let val = data.outputs[key];
                return {id: key, description: val.description, value: val.value};
            }),
            deploymentId : toolbox.getContext().getValue('deploymentId')
        });

        return (
            <OutputsTable data={formattedData} toolbox={toolbox}/>
        );
    }
});