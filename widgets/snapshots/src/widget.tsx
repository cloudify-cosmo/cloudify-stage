// @ts-nocheck File not migrated fully to TS

import SnapshotsTable from './SnapshotsTable';

Stage.defineWidget({
    id: 'snapshots',
    name: 'Snapshots list',
    description: 'Snapshots list',
    initialWidth: 4,
    initialHeight: 16,
    color: 'blue',
    isReact: true,
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
    fetchParams: (widget, toolbox) =>
        toolbox.getContext().getValue('onlyMyResources')
            ? { created_by: toolbox.getManager().getCurrentUsername() }
            : {},

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const selectedSnapshot = toolbox.getContext().getValue('snapshotId');
        const formattedData = {
            ...data,
            items: _.map(data.items, item => {
                return {
                    ...item,
                    created_at: Stage.Utils.Time.formatTimestamp(item.created_at), // 2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id
                };
            })
        };
        formattedData.total = _.get(data, 'metadata.pagination.total', 0);

        return <SnapshotsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
