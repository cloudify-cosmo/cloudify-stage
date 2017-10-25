/**
 * Created by kinneretzin on 28/03/2017.
 */

export default class ClusterNodesList extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null
        }
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render () {
        let {DataTable,Checkmark,ErrorMessage} = Stage.Basic;
        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>
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

                    {
                        this.props.nodes.items.map((item)=>{

                            return (

                                <DataTable.Row key={item.host_ip}>
                                    <DataTable.Data><a className='nodeName' href="javascript:void(0)">{item.name}</a></DataTable.Data>
                                    <DataTable.Data>{item.host_ip}</DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.initialized}/></DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.master}/></DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.online}/></DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>

            </div>
        )

    }
}