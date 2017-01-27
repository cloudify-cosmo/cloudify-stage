/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(snapshot) {
        return this.toolbox.getManager().doDelete(`/snapshots/${snapshot.id}`);

    }

    doRestore(snapshot) {
        return this.toolbox.getManager().doPost(`/snapshots/${snapshot.id}/restore`,null,{force: false, recreate_deployments_envs: false});
    }

    doUpload(snapshotUrl, snapshotId, file) {
        var params = {};

        if (!_.isEmpty(snapshotUrl)) {
            params['snapshot_archive_url'] = snapshotUrl;
        }

        return this.toolbox.getManager().doUpload(`/snapshots/${snapshotId}/archive`, params, file, 'put');
    }

    doCreate(snapshotId){
        return this.toolbox.getManager().doPut(`/snapshots/${snapshotId}`,null,{
            snapshot_id:snapshotId
        });
    }
}