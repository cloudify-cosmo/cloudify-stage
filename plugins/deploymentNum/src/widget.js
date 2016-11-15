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
                dataType: 'json',
                headers: context.getSecurityHeaders()
            }).done((deployments)=> {
                resolve({number: _.get(data, "metadata.pagination.total", 0)});
            }).fail(reject)
        });
    },

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Deployments" icon="cube" number={data.number}/>
        );
    }
});