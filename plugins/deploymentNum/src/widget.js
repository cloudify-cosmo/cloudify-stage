/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.addPlugin({
    id: "deploymentNum",
    name: "Number of deployments",
    description: 'Number of deployments',
    initialWidth: 2,
    initialHeight: 2,
    color : "violet",
    showHeader: false,
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 5}
    ],
    fetchUrl: '[manager]/deployments?_include=id',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Deployments" icon="cube" number={num}/>
        );
    }
});