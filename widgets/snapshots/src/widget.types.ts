import type { Visibility } from 'app/widgets/common/types';
import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { Widget } from 'app/utils/StageAPI';

export interface Snapshot {
    id?: string;
    /* eslint-disable camelcase */
    created_at?: string;
    created_by?: string;
    /* eslint-enable camelcase */
    visibility?: Visibility;
    status?: string;
}

export type SnapshotsWidget = Widget<DataTableConfiguration>;
