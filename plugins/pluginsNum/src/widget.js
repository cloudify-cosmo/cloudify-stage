/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.addPlugin({
    id: "pluginsNum",
    name: "Number of plugins",
    description: 'Number of plugins',
    initialWidth: 2,
    initialHeight: 2,
    color : "teal",
    showHeader: false,
    isReact: true,

    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl('/api/v2.1/plugins?_include=id'),
                dataType: 'json'
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
            <KeyIndicator title="Plugins" icon="plug" number={data.number}/>
        );
    }
});