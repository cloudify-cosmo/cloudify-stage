// @ts-nocheck File not migrated fully to TS

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(snapshot) {
        return this.toolbox.getManager().doDelete(`/snapshots/${snapshot.id}`);
    }

    doRestore(snapshot, shouldForceRestore, ignorePluginFailure) {
        return this.toolbox.getManager().doPost(`/snapshots/${snapshot.id}/restore`, {
            body: {
                force: shouldForceRestore,
                tenant_name: '',
                ignore_plugin_failure: ignorePluginFailure
            }
        });
    }

    doUpload(snapshotUrl, snapshotId, files) {
        if (files) {
            return this.toolbox.getManager().doUpload(`/snapshots/${snapshotId}/archive`, { files });
        }

        return this.toolbox
            .getManager()
            .doPut(`/snapshots/${snapshotId}/archive`, { params: { snapshot_archive_url: snapshotUrl } });
    }

    doDownload(snapshot) {
        const snapshotDownloadUrl = `/snapshots/${snapshot.id}/archive`;
        const snapshotCreationDateShort = moment(snapshot.created_at, 'DD-MM-YYYY HH:mm').format('YYYYMMDD_HHmm');
        const snapshotFileName = `${snapshot.id}_${snapshotCreationDateShort}.zip`;

        return this.toolbox.getManager().doDownload(snapshotDownloadUrl, snapshotFileName);
    }

    doCreate(snapshotId, includeCredentials, excludeLogs, excludeEvents, queue) {
        return this.toolbox.getManager().doPut(`/snapshots/${encodeURIComponent(snapshotId)}`, {
            body: {
                include_credentials: includeCredentials,
                include_logs: !excludeLogs,
                include_events: !excludeEvents,
                queue
            }
        });
    }
}
