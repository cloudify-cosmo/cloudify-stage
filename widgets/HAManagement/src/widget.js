/**
 * Created by kinneretzin on 28/03/2017.
 */

import ClusterManagement from './ClusterManagement';

Stage.defineWidget({
    id: 'HAManagement',
    name: "High Availability management",
    description: 'HA cluster management including - start/join cluster, list nodes in cluster',
    initialWidth: 12,
    initialHeight: 25,
    color: "green",
    isReact: true,
    isAdmin: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    fetchData(widget,toolbox,params) {
        var result = {};
        return toolbox.getManager().doGet('/cluster')
            .then((data)=>{
                result.state = data;

                if (data.initialized) {
                    return toolbox.getManager().doGet('/cluster/nodes',params)
                        .then((nodes)=>{
                            result.nodes = nodes;

                            return result;
                        })
                } else {
                    return result;
                }
            })
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        console.log(data);
        return (
            <ClusterManagement widget={widget} data={data} toolbox={toolbox}/>
        );

    }
});