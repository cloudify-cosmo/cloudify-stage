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

    doUpload(snapshotId,file) {
        return this.toolbox.getManager().doUpload(`/snapshots/${snapshotId}/archive`,null,file,'put');
    }

    doDownload(snapshot) {
        let snapshotDownloadUrl = `/snapshots/${snapshot.id}/archive`;
        let snapshotCreationDateShort = moment(snapshot.created_at,'DD-MM-YYYY HH:mm').format('YYYYMMDD_HHmm');
        let snapshotFileName = `${snapshot.id}_${snapshotCreationDateShort}.zip`;

        return this.toolbox.getManager().doDownload(snapshotDownloadUrl, snapshotFileName);
    }

    doCreate(snapshotId){
        return this.toolbox.getManager().doPut(`/snapshots/${snapshotId}`,null,{
            snapshot_id:snapshotId
        });
    }
}