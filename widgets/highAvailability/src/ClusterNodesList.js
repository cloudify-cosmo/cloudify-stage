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
        let {DataTable} = Stage.Basic;

        return (
            <div>
                <h4> Nodes</h4>
                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.nodes.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="nodesTable"
                           searchable={false}>

                    <DataTable.Column label="Name" name="hostname" width="30%"/>
                    <DataTable.Column label="Private IP" name="private_ip" width="20%"/>
                    <DataTable.Column label="Public IP" name="public_ip" width="20%"/>
                    <DataTable.Column label="Distribution" name="distribution" width="15%"/>
                    <DataTable.Column label="Version" name="version" width="15%"/>

                    {
                        this.props.nodes.items.map((item)=>{

                            return (

                                <DataTable.Row key={item.hostname}>
                                    <DataTable.Data>{item.hostname}</DataTable.Data>
                                    <DataTable.Data>{item.private_ip}</DataTable.Data>
                                    <DataTable.Data>{item.public_ip}</DataTable.Data>
                                    <DataTable.Data>{item.distribution}</DataTable.Data>
                                    <DataTable.Data>{item.version}</DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>
            </div>
        )

    }
}