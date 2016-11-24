/**
 * Created by kinneretzin on 07/09/2016.
 */

import SnapshotsTable from './SnapshotsTable';

Stage.addPlugin({
    id: "snapshots",
    name: "Snapshots list",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 4,
    color : "blue",
    isReact: true,
    fetchUrl: '[manager]/api/v2.1/snapshots?_include=id,created_at,status',

    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var selectedSnapshot = context.getValue('snapshotId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id
                })
            })
        });

        return (
            <SnapshotsTable widget={widget} data={formattedData} context={context}/>
        );
    }
});