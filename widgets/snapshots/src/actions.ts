import type { Toolbox } from 'app/utils/StageAPI';
import type { Snapshot } from 'widgets/snapshots/src/widget.types';

export default class {
    constructor(private toolbox: Toolbox) {}

    doDelete(snapshot: Snapshot) {
        return this.toolbox.getManager().doDelete(`/snapshots/${snapshot.id}`);
    }

    doRestore(snapshot: Snapshot, shouldForceRestore: boolean, ignorePluginFailure: boolean) {
        return this.toolbox.getManager().doPost(`/snapshots/${snapshot.id}/restore`, {
            body: {
                force: shouldForceRestore,
                tenant_name: '',
                ignore_plugin_failure: ignorePluginFailure
            }
        });
    }

    doUpload(snapshotUrl: string, snapshotId: string, files: File | null) {
        if (files) {
            return this.toolbox.getManager().doUpload(`/snapshots/${snapshotId}/archive`, { files });
        }

        return this.toolbox
            .getManager()
            .doPut(`/snapshots/${snapshotId}/archive`, { params: { snapshot_archive_url: snapshotUrl } });
    }

    doDownload(snapshot: Snapshot) {
        const snapshotDownloadUrl = `/snapshots/${snapshot.id}/archive`;
        const snapshotCreationDateShort = moment(snapshot.created_at, 'DD-MM-YYYY HH:mm').format('YYYYMMDD_HHmm');
        const snapshotFileName = `${snapshot.id}_${snapshotCreationDateShort}.zip`;

        return this.toolbox.getManager().doDownload(snapshotDownloadUrl, snapshotFileName);
    }

    doCreate(
        snapshotId: string,
        includeCredentials: boolean,
        excludeLogs: boolean,
        excludeEvents: boolean,
        queue: boolean
    ) {
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
