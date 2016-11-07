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
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 4,
    color : "blue",
    isReact: true,
    init: function(snapshotUtils) {
        UploadModal = renderUploadSnapshotModal(snapshotUtils);
        CreateModal = renderCreateSnapshotModal(snapshotUtils);
    },

    fetchData: function(snapshot,context,snapshotUtils) {
        return new Promise( (resolve,reject) => {
            snapshotUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/snapshots?_include=id,created_at,status',
                dataType: 'json'
                })
                .done((snapshots)=> {resolve(snapshots);})
                .fail(reject)
        });
    },

    render: function(widget,data,error,context,snapshotUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var selectedSnapshot = context.getValue('snapshotId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: snapshotUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id
                })
            })
        });

        return (
            <div>
                <div className="snapshotsButtons">
                    <CreateModal widget={widget} data={formattedData} context={context} utils={snapshotUtils}/>
                    <UploadModal widget={widget} data={formattedData} context={context} utils={snapshotUtils}/>
                 </div>
                <SnapshotsTable widget={widget} data={formattedData} context={context} utils={snapshotUtils}/>
            </div>
        );
    }
});