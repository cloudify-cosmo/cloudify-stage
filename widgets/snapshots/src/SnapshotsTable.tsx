import type { Snapshot, SnapshotsWidget } from 'widgets/snapshots/src/widget.types';
import type { Toolbox } from 'app/utils/StageAPI';
import type { DataTableProps } from 'cloudify-ui-components/typings/components/data/DataTable/DataTable';
import { camelCase } from 'lodash';
import { translate } from './widget.common';
import Actions from './actions';
import CreateModal from './CreateSnapshotModal';
import RestoreModal from './RestoreSnapshotModal';
import UploadModal from './UploadSnapshotModal';

const translateColumn = Stage.Utils.composeT(translate, 'columns');

interface SnapshotsTableProps {
    data: { items: Snapshot[]; total: number };
    toolbox: Toolbox;
    widget: SnapshotsWidget;
}

interface SnapshotsTableState {
    item?: Snapshot;
    confirmDelete: boolean;
    showRestore: boolean;
    error?: any;
}

type SnapshotActionHandler = (item: Snapshot, event: Event) => void;

export default class SnapshotsTable extends React.Component<SnapshotsTableProps, SnapshotsTableState> {
    constructor(props: SnapshotsTableProps) {
        super(props);

        this.state = {
            confirmDelete: false,
            showRestore: false,
            item: {}
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('snapshots:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: SnapshotsTableProps, nextState: SnapshotsTableState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('snapshots:refresh', this.refreshData);
    }

    fetchGridData: DataTableProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    deleteSnapshot = () => {
        const { item } = this.state;
        const { toolbox } = this.props;
        if (!item) {
            this.setState({ error: 'Something went wrong, no snapshot was selected for delete' });
            return;
        }

        const actions = new Actions(toolbox);
        actions
            .doDelete(item)
            .then(() => {
                this.setState({ confirmDelete: false, error: null });
                toolbox.refresh();
            })
            .catch((err: any) => {
                this.setState({ confirmDelete: false, error: err.message });
            });
    };

    deleteSnapshotConfirm: SnapshotActionHandler = (item, event) => {
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item
        });
    };

    restoreSnapshot: SnapshotActionHandler = (item, event) => {
        event.stopPropagation();

        this.setState({
            showRestore: true,
            item
        });
    };

    downloadSnapshot: SnapshotActionHandler = (item, event) => {
        event.stopPropagation();

        const { toolbox } = this.props;
        const actions = new Actions(toolbox);
        actions
            .doDownload(item)
            .then(() => {
                this.setState({ error: null });
            })
            .catch((err: any) => {
                this.setState({ error: err.message });
            });
    };

    selectSnapshot(item: Snapshot) {
        const { toolbox } = this.props;
        const oldSelectedSnapshotId = toolbox.getContext().getValue('snapshotId');
        toolbox.getContext().setValue('snapshotId', item.id === oldSelectedSnapshotId ? null : item.id);
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { confirmDelete, error, item: snapshot, showRestore } = this.state;
        const { data, toolbox, widget } = this.props;
        const { Confirm, ErrorMessage, DataTable, Icon, ResourceVisibility } = Stage.Basic;

        function createLabelledColumn(name: keyof Snapshot, width = 15) {
            return <DataTable.Column label={translateColumn(camelCase(name))} name={name} width={`${width}%`} />;
        }

        return (
            <div className="snapshotsTableDiv">
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    selectable
                    searchable
                    className="snapshotsTable"
                    noDataMessage={translate('noData')}
                >
                    {createLabelledColumn('id', 40)}
                    {createLabelledColumn('created_at', 20)}
                    {createLabelledColumn('status')}
                    {createLabelledColumn('created_by')}
                    <DataTable.Column width="10%" />

                    {data.items.map(item => {
                        const isUsable = item.status === 'created' || item.status === 'uploaded';
                        const isRemovable = isUsable || item.status === 'failed';
                        return (
                            <DataTable.Row
                                key={item.id}
                                selected={toolbox.getContext().getValue('snapshotId') === item.id}
                                onClick={() => this.selectSnapshot(item)}
                            >
                                <DataTable.Data verticalAlign="flexMiddle">
                                    {item.id}
                                    <ResourceVisibility visibility={item.visibility} className="rightFloated" />
                                </DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.status}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data textAlign="center" className="rowActions">
                                    <Icon
                                        name="undo"
                                        title={translate('actions.restore')}
                                        disabled={!isUsable}
                                        link={isUsable}
                                        onClick={_.wrap(item, this.restoreSnapshot)}
                                    />
                                    <Icon
                                        name="download"
                                        title={translate('actions.download')}
                                        disabled={!isUsable}
                                        link={isUsable}
                                        onClick={_.wrap(item, this.downloadSnapshot)}
                                    />
                                    <Icon
                                        name="trash"
                                        disabled={!isRemovable}
                                        link={isRemovable}
                                        title={translate('actions.delete')}
                                        onClick={_.wrap(item, this.deleteSnapshotConfirm)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <CreateModal widget={widget} toolbox={toolbox} />

                        <UploadModal toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                {snapshot && (
                    <RestoreModal
                        open={showRestore}
                        onHide={() => this.setState({ showRestore: false })}
                        toolbox={toolbox}
                        snapshot={snapshot}
                    />
                )}

                <Confirm
                    content={translate('confirmDelete')}
                    open={confirmDelete}
                    onConfirm={this.deleteSnapshot}
                    onCancel={() => this.setState({ confirmDelete: false })}
                />
            </div>
        );
    }
}
