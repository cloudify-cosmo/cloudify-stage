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
            confirmDelete:false
        }
    }

    _selectSnapshot (item){
        var oldSelectedSnapshotId = this.props.toolbox.getContext().getValue('snapshotId');
        this.props.toolbox.getContext().setValue('snapshotId',item.id === oldSelectedSnapshotId ? null : item.id);
    }

    _deleteSnapshotConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _restoreSnapshot(item,event) {
        event.stopPropagation();

        var actions = new Actions(this.props.toolbox);
        actions.doRestore(item).then(()=>{
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error:err.error});
        });
    }

    _downloadSnapshot(item,event) {
        event.stopPropagation();

        window.open(this.props.toolbox.getManager().getManagerUrl(`/snapshots/${item.id}/archive`));
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
            this.setState({confirmDelete: false, error: err.error});
        });
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
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Grid = Stage.Basic.Grid;

        return (
            <div className="snapshotsTableDiv">
                <ErrorMessage error={this.state.error}/>

                <Grid.Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.plugin.pageSize}
                            selectable={true}
                            className="snapshotsTable">

                    <Grid.Column label="Id" name="id" width="40%"/>
                    <Grid.Column label="Created at" name="created_at" width="25%"/>
                    <Grid.Column label="Status" name="status" width="20%"/>
                    <Grid.Column width="15%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Grid.Row key={item.id} select={item.isSelected} onClick={this._selectSnapshot.bind(this, item)}>
                                    <Grid.Data><a className='snapshotName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                    <Grid.Data>{item.created_at}</Grid.Data>
                                    <Grid.Data>{item.status}</Grid.Data>
                                    <Grid.Data className="center aligned rowActions">
                                        <i className="undo icon link bordered" title="Restore" onClick={this._restoreSnapshot.bind(this,item)}></i>
                                        <i className="download icon link bordered" title="Download" onClick={this._downloadSnapshot.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete" onClick={this._deleteSnapshotConfirm.bind(this,item)}></i>
                                    </Grid.Data>
                                </Grid.Row>
                            );
                        })
                    }

                    <Grid.Action>
                        <CreateModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>

                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </Grid.Action>

                </Grid.Table>

                <Confirm title='Are you sure you want to remove this snapshot?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteSnapshot.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

            </div>

        );
    }
};
