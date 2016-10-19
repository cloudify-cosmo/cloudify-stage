/**
 * Created by kinneretzin on 18/10/2016.
 */

import ExecuteWorkflow from './ExecuteWorkflow';

export default class extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete:false
        }
    }

    _selectDeployment(item) {
        this.props.context.setValue('deploymentId',item.id);
        this.props.context.drillDown(this.props.widget,'deployment');
    }

    _deleteDeploymentConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _deleteDeployment() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no deployment was selected for delete'});
            return;
        }

        var thi$ = this;
        $.ajax({
            url: thi$.props.context.getManagerUrl() + '/api/v2.1/deployments/'+this.state.item.id,
            "headers": {"content-type": "application/json"},
            method: 'delete'
        })
            .done(()=> {
                thi$.setState({confirmDelete: false});
                thi$.props.context.getEventBus().trigger('deployments:refresh');
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
        this.props.context.getEventBus().on('deployments:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('deployments:refresh',this._refreshData);
    }

    _initDropdown(dropdown) {
        var thi$ = this;
        $(dropdown).dropdown({
            onChange: (value, text, $choice) => {
                thi$.props.context.setValue('filterDep'+thi$.props.widget.id,value);
            }
        });

        var filter = this.props.context.getValue('filterDep'+this.props.widget.id);
        if (filter) {
            $(dropdown).dropdown('set selected',filter);
        }
    }
    render() {
        var Confirm = Stage.Basic.Confirm;

        return (
            <div>
                {
                    this.state.error ?
                        <div className="ui error message" style={{"display":"block"}}>
                            <div className="header">Error Occured</div>
                            <p>{this.state.error}</p>
                        </div>
                        :
                        ''
                }

                <div>
                    <div className="ui selection dropdown fluid" ref={this._initDropdown.bind(this)}>
                        <input type="hidden" name="statusFilter"/>
                        <div className="default text">Filter by status</div>
                        <i className="dropdown icon"></i>
                        <div className="menu">
                            <div className="item" data-value="ok">
                                <i className="check circle icon inverted green"></i>
                                OK
                            </div>
                            <div className="item" data-value="error">
                                <i className="remove circle icon inverted red"></i>
                                Error
                            </div>
                        </div>
                    </div>
                </div>

                <table className="ui very compact table deploymentTable">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Blueprint</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Status</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className='row' onClick={this._selectDeployment.bind(this,item)}>
                                    <td>
                                        <div>
                                            <a className='deploymentName' href="javascript:void(0)">{item.id}</a>
                                        </div>
                                    </td>
                                    <td>{item.blueprint_id}</td>
                                    <td>{item.created_at}</td>
                                    <td>{item.updated_at}</td>
                                    <td>
                                        { item.status === 'ok' ?
                                            <i className="check circle icon inverted green"></i>
                                            :
                                            <i className="remove circle icon inverted red"></i>
                                        }
                                    </td>

                                    <td>
                                        <div className="rowActions">
                                            <ExecuteWorkflow item={item}/>
                                            <i className="write icon link bordered" title="Edit deployment"></i>
                                            <i className="trash icon link bordered" title="Delete deployment" onClick={this._deleteDeploymentConfirm.bind(this,item)}></i>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                <Confirm title='Are you sure you want to remove this deployment?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteDeployment.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
}
