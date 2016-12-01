/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(context) {
        this.context = context;
    }

    doDelete(snapshot) {
        return this.context.getManager().doDelete(`/snapshots/${snapshot.id}`);

    }

    doRestore(snapshot) {
        return this.context.getManager().doPost(`/snapshots/${snapshot.id}/restore`,null,{force: false, recreate_deployments_envs: false});
    }

    doUpload(snapshotId,file) {
        return this.context.getManager().doUpload(`/snapshots/${snapshotId}/archive`,null,file,'put');
    }

    doCreate(snapshotId){
        return this.context.getManager().doPut(`/snapshots/${snapshotId}`,null,{
            snapshot_id:snapshotId
        });
    }
}