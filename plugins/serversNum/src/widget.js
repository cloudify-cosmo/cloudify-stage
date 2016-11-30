/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.addPlugin({
    id: "serversNum",
    name: "Number of servers",
    description: 'Number of servers',
    initialWidth: 4,
    initialHeight: 2,
    color : "green",
    showHeader: false,
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 5}
    ],

    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl('/api/v2.1/node-instances?_include=id'),
                dataType: 'json',
                headers: context.getSecurityHeaders()
            }).done((data)=> {
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
            <KeyIndicator title="Servers" icon="server" number={data.number}/>
        );
    }
});