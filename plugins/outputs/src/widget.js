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

    fetchData: function(plugin,context,pluginUtils) {
        let deploymentId = context.getValue('deploymentId');

        return new Promise( (resolve,reject) => {
            if (deploymentId) {
                $.get({
                    url: context.getManagerUrl(`/api/v2.1/deployments?_include=id,outputs&id=${deploymentId}`),
                    dataType: 'json',
                    headers: context.getSecurityHeaders()
                }).done((data)=> {
                    //for selected deployemntId there should be only one item including all outputs
                    resolve({outputs: _.get(data, "items[0].outputs", {})});
                }).fail(reject)
            } else {
                resolve({outputs:{}});
            }
        });
    },

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        let formattedData = Object.assign({},data,{
            items: Object.keys(data.outputs).map(function(key) {
                let val = data.outputs[key];
                return {id: key, description: val.description, value: val.value};
            }),
            deploymentId : context.getValue('deploymentId')
        });

        return (
            <OutputsTable data={formattedData} context={context}/>
        );
    }
});