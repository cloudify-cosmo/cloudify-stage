/**
 * Created by kinneretzin on 02/10/2016.
 */
import Actions from './actions';
import CreateModal from './CreateSnapshotModal';
import RestoreModal from './RestoreSnapshotModal';
import UploadModal from './UploadSnapshotModal';
import SnapshotPropType from './props/SnapshotPropType';

export default class SnapshotsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

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

    shouldComponentUpdate(nextProps, nextState) {
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

    fetchGridData = fetchParams => {
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
            .catch(err => {
                this.setState({ confirmDelete: false, error: err.message });
            });
    };

    deleteSnapshotConfirm = (item, event) => {
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item
        });
    };

    restoreSnapshot = (item, event) => {
        event.stopPropagation();

        this.setState({
            showRestore: true,
            item
        });
    };

    downloadSnapshot = (item, event) => {
        event.stopPropagation();

        const { toolbox } = this.props;
        const actions = new Actions(toolbox);
        actions
            .doDownload(item)
            .then(() => {
                this.setState({ error: null });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    };

    selectSnapshot(item) {
        const { toolbox } = this.props;
        const oldSelectedSnapshotId = toolbox.getContext().getValue('snapshotId');
        toolbox.getContext().setValue('snapshotId', item.id === oldSelectedSnapshotId ? null : item.id);
    }

    isSnapshotUseful(snapshot) {
        return snapshot.status === 'created' || snapshot.status === 'uploaded';
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { confirmDelete, error, item, showRestore } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Snapshots available. Click "Create" to create Snapshots.';
        const { Confirm, ErrorMessage, DataTable, Icon, ResourceVisibility } = Stage.Basic;

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
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="Name" name="id" width="40%" />
                    <DataTable.Column label="Created at" name="created_at" width="20%" />
                    <DataTable.Column label="Status" name="status" width="15%" />
                    <DataTable.Column label="Creator" name="created_by" width="15%" />
                    <DataTable.Column width="10%" />

                    {data.items.map(item => {
                        const isSnapshotUseful = this.isSnapshotUseful(item);
                        return (
                            <DataTable.Row
                                key={item.id}
                                selected={item.isSelected}
                                onClick={() => this.selectSnapshot(item)}
                            >
                                <DataTable.Data>
                                    {item.id}
                                    <ResourceVisibility visibility={item.visibility} className="rightFloated" />
                                </DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.status}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon
                                        name="undo"
                                        title="Restore"
                                        bordered
                                        disabled={!isSnapshotUseful}
                                        link={isSnapshotUseful}
                                        onClick={_.wrap(item, this.restoreSnapshot)}
                                    />
                                    <Icon
                                        name="download"
                                        title="Download"
                                        bordered
                                        disabled={!isSnapshotUseful}
                                        link={isSnapshotUseful}
                                        onClick={_.wrap(item, this.downloadSnapshot)}
                                    />
                                    <Icon
                                        name="trash"
                                        link
                                        bordered
                                        title="Delete"
                                        onClick={_.wrap(item, this.deleteSnapshotConfirm)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <CreateModal widget={widget} data={data} toolbox={toolbox} />

                        <UploadModal widget={widget} data={data} toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                <RestoreModal
                    open={showRestore}
                    onHide={() => this.setState({ showRestore: false })}
                    toolbox={toolbox}
                    snapshot={item}
                />

                <Confirm
                    content="Are you sure you want to remove this snapshot?"
                    open={confirmDelete}
                    onConfirm={this.deleteSnapshot}
                    onCancel={() => this.setState({ confirmDelete: false })}
                />
            </div>
        );
    }
}

SnapshotsTable.propTypes = {
    data: PropTypes.shape({
        items: PropTypes.arrayOf(SnapshotPropType),
        total: PropTypes.number
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
