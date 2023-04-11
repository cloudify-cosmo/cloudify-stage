import type { PaginatedResponse } from 'backend/types';
import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { Snapshot } from './widget.types';
import SnapshotsTable from './SnapshotsTable';

// eslint-disable-next-line camelcase
Stage.defineWidget<{ created_by?: string }, PaginatedResponse<Snapshot>, DataTableConfiguration>({
    id: 'snapshots',
    initialWidth: 4,
    initialHeight: 16,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('snapshots'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    fetchUrl: '[manager]/snapshots?_include=id,created_at,status,created_by,visibility[params]',
    fetchParams: (_widget, toolbox) =>
        toolbox.getContext().getValue('onlyMyResources')
            ? { created_by: toolbox.getManager().getCurrentUsername() }
            : {},

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const formattedData = {
            ...data,
            items: _.map(data?.items, item => {
                return {
                    ...item,
                    created_at: Stage.Utils.Time.formatTimestamp(item.created_at) // 2016-07-20 09:10:53.103579
                };
            }),
            total: _.get(data, 'metadata.pagination.total', 0)
        };

        return <SnapshotsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
