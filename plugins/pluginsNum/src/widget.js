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
    initialConfiguration: [
        {id: "pollingTime", default: 5}
    ],
    fetchUrl: '[manager]/plugins?_include=id',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Plugins" icon="plug" number={num}/>
        );
    }
});