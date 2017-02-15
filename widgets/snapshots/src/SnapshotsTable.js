/**
 * Created by kinneretzin on 02/10/2016.
 */
import UploadModal from './UploadSnapshotModal';
import CreateModal from './CreateSnapshotModal';

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete: false
        }
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

        var actions = new Actions(this.props.toolbox);
        actions.doRestore(item).then(()=>{
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error:err.message});
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
                            selectable={true}
                            className="snapshotsTable">

                    <DataTable.Column label="Id" name="id" width="40%"/>
                    <DataTable.Column label="Created at" name="created_at" width="25%"/>
                    <DataTable.Column label="Status" name="status" width="20%"/>
                    <DataTable.Column width="15%"/>

                    {
                        this.props.data.items.map((item)=>{
                            let isSnapshotUseful = this._isSnapshotUseful(item);
                            return (
                                <DataTable.Row key={item.id} selected={item.isSelected} onClick={this._selectSnapshot.bind(this, item)}>
                                    <DataTable.Data><a className='snapshotName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
                                    <DataTable.Data>{item.created_at}</DataTable.Data>
                                    <DataTable.Data>{item.status}</DataTable.Data>
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

                <Confirm title='Are you sure you want to remove this snapshot?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteSnapshot.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

            </div>

        );
    }
};
