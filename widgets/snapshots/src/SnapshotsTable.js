/**
 * Created by kinneretzin on 02/10/2016.
 */
import UploadModal from './UploadSnapshotModal';
import CreateModal from './CreateSnapshotModal';
import RestoreModal from './RestoreSnapshotModal.js';

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete: false,
            showRestore: false,
            item: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _selectSnapshot (item){
        var oldSelectedSnapshotId = this.props.toolbox.getContext().getValue('snapshotId');
        this.props.toolbox.getContext().setValue('snapshotId',item.id === oldSelectedSnapshotId ? null : item.id);
    }

    _deleteSnapshotConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item: item
        });
    }

    _restoreSnapshot(item,event) {
        event.stopPropagation();

        this.setState({
            showRestore: true,
            item: item
        });
    }

    _downloadSnapshot(item,event) {
        event.stopPropagation();

        let actions = new Actions(this.props.toolbox);
        actions.doDownload(item)
               .catch((err) => {this.setState({error: err.message})});
    }

    _deleteSnapshot() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no snapshot was selected for delete'});
            return;
        }

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.item).then(()=>{
            this.setState({confirmDelete: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({confirmDelete: false, error: err.message});
        });
    }

    _isSnapshotUseful(snapshot) {
        return snapshot.status === 'created' || snapshot.status === 'uploaded';
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('snapshots:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('snapshots:refresh',this._refreshData);
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        let {Confirm, ErrorMessage, DataTable, Icon} = Stage.Basic;

        return (
            <div className="snapshotsTableDiv">
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className="snapshotsTable">

                    <DataTable.Column label="Id" name="id" width="40%"/>
                    <DataTable.Column label="Created at" name="created_at" width="20%"/>
                    <DataTable.Column label="Status" name="status" width="15%"/>
                    <DataTable.Column label="Creator" name='created_by' width="15%"/>
                    <DataTable.Column width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            let isSnapshotUseful = this._isSnapshotUseful(item);
                            return (
                                <DataTable.Row key={item.id} selected={item.isSelected} onClick={this._selectSnapshot.bind(this, item)}>
                                    <DataTable.Data><a className='snapshotName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
                                    <DataTable.Data>{item.created_at}</DataTable.Data>
                                    <DataTable.Data>{item.status}</DataTable.Data>
                                    <DataTable.Data>{item.created_by}</DataTable.Data>
                                    <DataTable.Data className="center aligned rowActions">
                                        <Icon name='undo' title="Restore" bordered disabled={!isSnapshotUseful} link={isSnapshotUseful}
                                              onClick={isSnapshotUseful ? this._restoreSnapshot.bind(this,item) : ()=>{}} />
                                        <Icon name='download' title="Download" bordered disabled={!isSnapshotUseful} link={isSnapshotUseful}
                                              onClick={isSnapshotUseful ? this._downloadSnapshot.bind(this,item) : ()=>{}} />
                                        <Icon name='trash' link bordered title="Delete" onClick={this._deleteSnapshotConfirm.bind(this,item)} />
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }

                    <DataTable.Action>
                        <CreateModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>

                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </DataTable.Action>

                </DataTable>

                <RestoreModal open={this.state.showRestore}
                              onHide={()=>this.setState({showRestore : false})}
                              toolbox={this.props.toolbox}
                              snapshot={this.state.item}/>

                <Confirm content='Are you sure you want to remove this snapshot?'
                         open={this.state.confirmDelete}
                         onConfirm={this._deleteSnapshot.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

            </div>

        );
    }
};
