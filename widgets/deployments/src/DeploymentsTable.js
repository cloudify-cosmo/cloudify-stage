/**
 * Created by kinneretzin on 18/10/2016.
 */

import PropTypes from 'prop-types';

import MenuAction from './MenuAction';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';
import LastExecutionStatusIcon from './LastExecutionStatusIcon';

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onShowLogs: PropTypes.func,
        onShowUpdateDetails: PropTypes.func,
        onCancelExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        noDataMessage: PropTypes.string,
        showExecutionStatusLabel: PropTypes.bool
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onCancelExecution: ()=>{},
        onMenuAction: ()=>{},
        onError: ()=>{},
        onSetVisibility: ()=>{},
        allowedSettingTo: ['tenant'],
        noDataMessage: ''
    };

    render() {
        var {DataTable, ResourceVisibility} = Stage.Basic;
        let tableName = 'deploymentsTable';

        return (
            <DataTable fetchData={this.props.fetchData}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       sortColumn={this.props.widget.configuration.sortColumn}
                       sortAscending={this.props.widget.configuration.sortAscending}
                       selectable={true}
                       searchable={true}
                       className={tableName}
                       noDataMessage={this.props.noDataMessage}>

                <DataTable.Column label="Name" name="id" width="25%"/>
                <DataTable.Column label="Last Execution" />
                <DataTable.Column label="Blueprint" name="blueprint_id" width="20%" show={!this.props.data.blueprintId}/>
                <DataTable.Column label="Created" name="created_at" width="15%"/>
                <DataTable.Column label="Updated" name="updated_at" width="15%"/>
                <DataTable.Column label="Creator" name='created_by' width="10%"/>
                <DataTable.Column width="5%"/>

                {
                    this.props.data.items.map((item)=>{

                        return (

                            <DataTable.Row id={`${tableName}_${item.id}`} key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
                                <DataTable.Data>
                                    <a className='deploymentName' href="javascript:void(0)">{item.id}</a>
                                    <ResourceVisibility visibility={item.visibility}
                                                        onSetVisibility={(visibility) => this.props.onSetVisibility(item.id, visibility)}
                                                        allowedSettingTo={this.props.allowedSettingTo} className="rightFloated"/>
                                </DataTable.Data>
                                <DataTable.Data>
                                    <LastExecutionStatusIcon execution={item.lastExecution}
                                                             onShowLogs={() => this.props.onShowLogs(item.id, item.lastExecution.id)}
                                                             onShowUpdateDetails={this.props.onShowUpdateDetails}
                                                             onCancelExecution={this.props.onCancelExecution}
                                                             showLabel={this.props.showExecutionStatusLabel}
                                                             labelAttached={false} />
                                </DataTable.Data>
                                <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                <DataTable.Data>
                                    {item.created_at}
                                    <DeploymentUpdatedIcon deployment={item} />
                                </DataTable.Data>
                                <DataTable.Data>{item.updated_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <MenuAction item={item} disabled={!_.isEmpty(item.executions)}
                                                onSelectAction={this.props.onMenuAction} />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })
                }
            </DataTable>
        );
    }
}