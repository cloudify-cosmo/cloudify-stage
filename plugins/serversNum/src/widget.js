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
    fetchUrl: '[manager]/node-instances?_include=id',

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Servers" icon="server" number={num}/>
        );
    }
});