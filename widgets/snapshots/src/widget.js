/**
 * Created by kinneretzin on 07/09/2016.
 */

import SnapshotsTable from './SnapshotsTable';

Stage.defineWidget({
    id: "snapshots",
    name: "Snapshots list",
    description: 'Snapshots list',
    initialWidth: 4,
    initialHeight: 4,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],
    fetchUrl: '[manager]/snapshots?_include=id,created_at,status[params]',

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedSnapshot = toolbox.getContext().getValue('snapshotId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id
                })
            })
        });
        formattedData.total =  _.get(data, "metadata.pagination.total", 0);

        return (
            <SnapshotsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});