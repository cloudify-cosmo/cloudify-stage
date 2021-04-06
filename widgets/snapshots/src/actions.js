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

    doRestore(snapshot, shouldForceRestore, ignorePluginFailure) {
        return this.toolbox.getManager().doPost(`/snapshots/${snapshot.id}/restore`, null, {
            force: shouldForceRestore,
            tenant_name: '',
            ignore_plugin_failure: ignorePluginFailure
        });
    }

    doUpload(snapshotUrl, snapshotId, file) {
        if (file) {
            return this.toolbox.getManager().doUpload(`/snapshots/${snapshotId}/archive`, {}, file, 'put');
        }

        return this.toolbox
            .getManager()
            .doPut(`/snapshots/${snapshotId}/archive`, { snapshot_archive_url: snapshotUrl });
    }

    doDownload(snapshot) {
        const snapshotDownloadUrl = `/snapshots/${snapshot.id}/archive`;
        const snapshotCreationDateShort = moment(snapshot.created_at, 'DD-MM-YYYY HH:mm').format('YYYYMMDD_HHmm');
        const snapshotFileName = `${snapshot.id}_${snapshotCreationDateShort}.zip`;

        return this.toolbox.getManager().doDownload(snapshotDownloadUrl, snapshotFileName);
    }

    doCreate(snapshotId, includeCredentials, excludeLogs, excludeEvents, queue) {
        return this.toolbox.getManager().doPut(`/snapshots/${encodeURIComponent(snapshotId)}`, null, {
            include_credentials: includeCredentials,
            include_logs: !excludeLogs,
            include_events: !excludeEvents,
            queue
        });
    }
}
