/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.addPlugin({
    id: "deploymentNum",
    name: "Number of deployments",
    description: 'Number of deployments',
    initialWidth: 4,
    initialHeight: 2,
    color : "violet",
    showHeader: false,
    isReact: true,

    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl('/api/v2.1/deployments?_include=id'),
                dataType: 'json'
            }).done((deployments)=> {
                resolve({number: deployments.metadata.pagination.total});
            }).fail(reject)
        });
    },

    render: function(widget,data,error,context,pluginUtils) {
        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Deployments" icon="cube" number={data.number}/>
        );
    }
});