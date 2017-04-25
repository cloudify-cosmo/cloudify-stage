/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import ActiveExecutionStatus from './ActiveExecutionStatus';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onCancelExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onCancelExecution: ()=>{},
        onMenuAction: ()=>{},
        onError: ()=>{}
    };

    render() {
        var DataTable = Stage.Basic.DataTable;

        return (
            <DataTable fetchData={this.props.fetchData}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       sortColumn={this.props.widget.configuration.sortColumn}
                       sortAscending={this.props.widget.configuration.sortAscending}
                       selectable={true}
                       className="deploymentTable">

                <DataTable.Column label="Name" name="id" width="25%"/>
                <DataTable.Column label="Blueprint" name="blueprint_id" width="25%"/>
                <DataTable.Column label="Created" name="created_at" width="15%"/>
                <DataTable.Column label="Updated" name="updated_at" width="15%"/>
                <DataTable.Column label="Creator" name='created_by' width="10%"/>
                <DataTable.Column width="10%"/>

                {
                    this.props.data.items.map((item)=>{

                        return (

                            <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
                                <DataTable.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
                                <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.updated_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    {
                                        _.isEmpty(item.executions)
                                        ?
                                        <MenuAction item={item} onSelectAction={this.props.onMenuAction}/>
                                        :
                                        <ActiveExecutionStatus item={item.executions[0]} onCancelExecution={this.props.onCancelExecution}/>
                                    }
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })
                }
            </DataTable>
        );
    }
}