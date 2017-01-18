/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "serversNum",
    name: "Number of servers",
    description: 'Number of servers',
    initialWidth: 2,
    initialHeight: 2,
    color : "green",
    showHeader: false,
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/node-instances?_include=id',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Servers" icon="server" number={num}/>
        );
    }
});