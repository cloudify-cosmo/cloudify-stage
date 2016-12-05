/**
 * Created by kinneretzin on 07/09/2016.
 */

import SnapshotsTable from './SnapshotsTable';
import renderUploadSnapshotModal from './UploadSnapshotModal';
import renderCreateSnapshotModal from './CreateSnapshotModal';

var UploadModal = null;
var CreateModal = null;

Stage.addPlugin({
    id: "snapshots",
    name: "Snapshots list",
    description: 'Snapshots list',
    initialWidth: 4,
    initialHeight: 4,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 30}
    ],
    init: function(pluginUtils) {
        UploadModal = renderUploadSnapshotModal(pluginUtils);
        CreateModal = renderCreateSnapshotModal(pluginUtils);
    },

    fetchUrl: '[manager]/snapshots?_include=id,created_at,status',

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
            <div>
                <div className="snapshotsButtons">
                    <CreateModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                    <UploadModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                 </div>
                <SnapshotsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
            </div>
        );
    }
});