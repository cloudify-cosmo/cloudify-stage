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

    doRestore(snapshot,shouldForceRestore,newTenantName) {
        return this.toolbox.getManager().doPost(`/snapshots/${snapshot.id}/restore`,null,
            {force: shouldForceRestore, recreate_deployments_envs: false, tenant_name: newTenantName});
    }

    doUpload(snapshotUrl, snapshotId, file) {
        var params = {};

        if (!_.isEmpty(snapshotUrl)) {
            params['snapshot_archive_url'] = snapshotUrl;
        }

        if (file) {
            return this.toolbox.getManager().doUpload(`/snapshots/${snapshotId}/archive`, params, file, 'put');
        } else {
            return this.toolbox.getManager().doPut(`/snapshots/${snapshotId}/archive`, params);
        }
    }

    doDownload(snapshot) {
        let snapshotDownloadUrl = `/snapshots/${snapshot.id}/archive`;
        let snapshotCreationDateShort = moment(snapshot.created_at,'DD-MM-YYYY HH:mm').format('YYYYMMDD_HHmm');
        let snapshotFileName = `${snapshot.id}_${snapshotCreationDateShort}.zip`;

        return this.toolbox.getManager().doDownload(snapshotDownloadUrl, snapshotFileName);
    }

    doCreate(snapshotId, includeMetrics=false, includeCredentials=false){
        snapshotId = encodeURIComponent(snapshotId);
        return this.toolbox.getManager().doPut(`/snapshots/${snapshotId}`, null, {
            include_metrics: includeMetrics,
            include_credentials: includeCredentials
        });
    }
}