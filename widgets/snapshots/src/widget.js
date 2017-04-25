/**
 * Created by kinneretzin on 07/09/2016.
 */

import SnapshotsTable from './SnapshotsTable';

Stage.defineWidget({
    id: "snapshots",
    name: "Snapshots list",
    description: 'Snapshots list',
    initialWidth: 4,
    initialHeight: 16,
    color : "blue",
    isReact: true,
    isAdmin: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    fetchUrl: '[manager]/snapshots?_include=id,created_at,status,created_by[params]',

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedSnapshot = toolbox.getContext().getValue('snapshotId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: Stage.Utils.formatTimestamp(item.created_at), //2016-07-20 09:10:53.103579
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