/**
 * Created by kinneretzin on 28/03/2017.
 */

import Actions from './actions';

export default class ClusterNodesList extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete: false,
            error: null
        }
    }

    fetchData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    _deleteNodeConfirm (item,event) {
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item: item
        });
    }

    _removeFromCluster() {
        this.props.toolbox.loading(true);

        this.setState({confirmDelete: false});

        var actions = new Actions(this.props.toolbox);
        actions.doDeleteClusterNode(this.state.item)
            .then(()=> {
                this.setState({error: null});
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('cluster:refresh');
            })
            .catch((err)=>{
                this.setState({error: err.message});
                this.props.toolbox.loading(false);
            });
    }


    render () {
        let {DataTable,Checkmark,ErrorMessage,Icon,Confirm} = Stage.Basic;
        return (
            <div>
                <ErrorMessage error={this.state.error}/>
                <h4> Nodes</h4>
                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.nodes.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="nodesTable">

                    <DataTable.Column label="Name" name="name" width="25%"/>
                    <DataTable.Column label="Host IP" name="host_ip" width="20%"/>
                    <DataTable.Column label="Initialized" name="initialized" width="10%"/>
                    <DataTable.Column label="Is master" name="master" width="10%"/>
                    <DataTable.Column label="Is online" name="online" width="10%"/>
                    <DataTable.Column width="15%"/>

                    {
                        this.props.nodes.items.map((item)=>{

                            return (

                                <DataTable.Row key={item.host_ip}>
                                    <DataTable.Data><a className='nodeName' href="javascript:void(0)">{item.name}</a></DataTable.Data>
                                    <DataTable.Data>{item.host_ip}</DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.initialized}/></DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.master}/></DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.online}/></DataTable.Data>
                                    <DataTable.Data className="center aligned rowActions">
                                        <Icon name='trash' link bordered title="Delete" onClick={this._deleteNodeConfirm.bind(this,item)} />
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>


                <Confirm content='This action is irreversible. Separating from the cluster will leave the Cloudify Manager instance unusable.Are you sure?'
                         open={this.state.confirmDelete}
                         onConfirm={this._removeFromCluster.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

            </div>
        )

    }
}