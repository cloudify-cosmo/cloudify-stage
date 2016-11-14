/**
 * Created by kinneretzin on 02/10/2016.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete:false
        }
    }

    _selectSnapshot (item){
        var oldSelectedSnapshotId = this.props.context.getValue('snapshotId');
        this.props.context.setValue('snapshotId',item.id === oldSelectedSnapshotId ? null : item.id);
    }

    _deleteSnapshotConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _restoreSnapshot(item,event) {
        var thi$ = this;
        var data = {force: false, recreate_deployments_envs: false};
        $.ajax({
            url: thi$.props.context.getManagerUrl(`/api/v2.1/snapshots/${item.id}/restore`),
            "headers": {"content-type": "application/json"},
            data: JSON.stringify(data),
            dataType: "json",
            method: 'post'
        })
            .done(()=> {
                thi$.props.context.getEventBus().trigger('snapshots:refresh');
              })
            .fail((jqXHR, textStatus, errorThrown)=>{
                thi$.setState({error: (jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)})
            });
    }

    _downloadSnapshot(item,event) {
        var thi$ = this;
        $.ajax({
            url: thi$.props.context.getManagerUrl(`/api/v2.1/snapshots/${item.id}/archive`),
            method: 'get'
        })
            .done(()=> {
                  window.location = thi$.props.context.getManagerUrl(`/api/v2.1/snapshots/${item.id}/archive`);
              })
            .fail((jqXHR, textStatus, errorThrown)=>{
                thi$.setState({error: (jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)})
            });
    }

    _deleteSnapshot() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no snapshot was selected for delete'});
            return;
        }

        var thi$ = this;
        $.ajax({
            url: thi$.props.context.getManagerUrl(`/api/v2.1/snapshots/${this.state.item.id}`),
            "headers": {"content-type": "application/json"},
            method: 'delete'
        })
            .done(()=> {
                thi$.setState({confirmDelete: false});
                thi$.props.context.getEventBus().trigger('snapshots:refresh');
            })
            .fail((jqXHR, textStatus, errorThrown)=>{
                thi$.setState({confirmDelete: false});
                thi$.setState({error: (jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)})
            });
    }

    _refreshData() {
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('snapshots:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('snapshots:refresh',this._refreshData);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div className="snapshotsTableDiv">
                <ErrorMessage error={this.state.error}/>

                <table className="ui very compact table snapshotsTable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Created at</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className={"row "+ (item.isSelected ? 'active' : '')} onClick={this._selectSnapshot.bind(this,item)}>
                                    <td>
                                        <div>
                                            <a className='snapshotName' href="javascript:void(0)">{item.id}</a>
                                        </div>
                                    </td>
                                    <td>{item.created_at}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <div className="rowActions">
                                            <i className="undo icon link bordered" title="Restore" onClick={this._restoreSnapshot.bind(this,item)}></i>
                                            <i className="download icon link bordered" title="Download" onClick={this._downloadSnapshot.bind(this,item)}></i>
                                            <i className="trash icon link bordered" title="Delete" onClick={this._deleteSnapshotConfirm.bind(this,item)}></i>
                                        </div>
                                    </td>
                            </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                <Confirm title='Are you sure you want to remove this snapshot?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteSnapshot.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
