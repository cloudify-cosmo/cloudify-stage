import OutputsTable from './OutputsTable';

Stage.addPlugin({
    id: "outputs",
    name: "Deployment Outputs",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    isReact: true,
    init: function(pluginUtils) {
    },

    fetchData: function(output,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl('/api/v2.1/deployments?_include=id,outputs'),
                dataType: 'json'
                })
                .done((outputs)=> {resolve(outputs);})
                .fail(reject)
        });
    },

    render: function(widget,data,error,context,pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var deploymentId = context.getValue('deploymentId');
        var filteredItems = {items:[]};
        var formattedData = {items:[]};
        if (deploymentId) {
            filteredItems.items = _.filter(data.items,{id:deploymentId});
            formattedData = Object.assign({},data,{
                items: _.map (filteredItems.items,(item)=>{
                    var description = "";
                    var value = "";
                    if (item.outputs.endpoint)
                    {
                        description = item.outputs.endpoint.description;
                        value = JSON.stringify(item.outputs.endpoint.value);
                    }
                    return Object.assign({},item,{
                        id: item.id,
                        description: description,
                        value: value
                    })
                })
            });

        }

        return (
            <div>
                <OutputsTable widget={widget} data={formattedData} context={context} utils={pluginUtils} deploymentId={deploymentId}/>
            </div>
        );
    }
});