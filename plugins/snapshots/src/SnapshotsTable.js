/**
 * Created by kinneretzin on 02/10/2016.
 */

import Actions from './actions';

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
        event.stopPropagation();

        (new Actions(this.props.context)).doRestore(item).then(()=>{
            this.props.context.refresh();
        }).catch((err)=>{
            this.setState({error:err.error});
        });
    }

    _downloadSnapshot(item,event) {
        event.stopPropagation();

        window.open(this.props.context.getManager()._buildActualUrl(`/snapshots/${item.id}/archive`));
    }

    _deleteSnapshot() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no snapshot was selected for delete'});
            return;
        }

        (new Actions(this.props.context)).doDelete(this.state.item).then(()=>{
            this.setState({confirmDelete: false});
            this.props.context.refresh();
        }).catch((err)=>{
            this.setState({confirmDelete: false,error: err.error});
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
