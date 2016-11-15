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

    _selectBlueprint (item){
        var oldSelectedBlueprintId = this.props.context.getValue('blueprintId');
        this.props.context.setValue('blueprintId',item.id === oldSelectedBlueprintId ? null : item.id);
    }

    _createDeployment(item,event){
        event.stopPropagation();

        this.props.context.setValue(this.props.widget.id + 'createDeploy',item);
    }

    _deleteBlueprintConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _deleteBlueprint() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no blueprint was selected for delete'});
            return;
        }

        var thi$ = this;
        $.ajax({
            url: thi$.props.context.getManagerUrl(`/api/v2.1/blueprints/${this.state.item.id}`),
            "headers": Object.assign({"content-type": "application/json"},thi$.props.context.getSecurityHeaders()),
            method: 'delete'
        })
            .done(()=> {
                thi$.setState({confirmDelete: false});
                thi$.props.context.getEventBus().trigger('blueprints:refresh');
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
        this.props.context.getEventBus().on('blueprints:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('blueprints:refresh',this._refreshData);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <table className="ui very compact table blueprintsTable">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th># Deployments</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className={"row "+ (item.isSelected ? 'active' : '')} onClick={this._selectBlueprint.bind(this,item)}>
                                    <td>
                                        <div>
                                            <a className='blueprintName' href="javascript:void(0)">{item.id}</a>
                                        </div>
                                    </td>
                                    <td>{item.created_at}</td>
                                    <td>{item.updated_at}</td>
                                    <td><div className="ui green horizontal label">{item.depCount}</div></td>
                                    <td>
                                        <div className="rowActions">
                                            <i className="rocket icon link bordered" title="Create deployment" onClick={this._createDeployment.bind(this,item)}></i>
                                            <i className="trash icon link bordered" title="Delete blueprint" onClick={this._deleteBlueprintConfirm.bind(this,item)}></i>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                <Confirm title='Are you sure you want to remove this blueprint?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteBlueprint.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
