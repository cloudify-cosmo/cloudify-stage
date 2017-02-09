/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "pluginsNum",
    name: "Number of plugins",
    description: 'Number of plugins',
    initialWidth: 2,
    initialHeight: 8,
    color : "teal",
    showHeader: false,
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
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