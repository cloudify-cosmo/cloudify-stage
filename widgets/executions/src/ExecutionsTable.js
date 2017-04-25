/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('executions:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('executions:refresh', this._refreshData);
    }

    _selectExecution(item) {
        var oldSelectedExecutionId = this.props.toolbox.getContext().getValue('executionId');
        this.props.toolbox.getContext().setValue('executionId',item.id === oldSelectedExecutionId ? null : item.id);
    }

    _cancelExecution(execution, action) {
        let actions = new Stage.Common.ExecutionActions(this.props.toolbox);
        actions.doCancel(execution, action)
            .then(() => {
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.toolbox.getEventBus().trigger('executions:refresh');
            })
            .catch((err) => {this.setState({error: err.message});});
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        let {ErrorMessage, DataTable, HighlightText, Overlay, Checkmark} = Stage.Basic;
        let {ExecutionStatus} = Stage.Common;

        let fieldsToShow = this.props.widget.configuration.fieldsToShow;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className="executionsTable">

                    <DataTable.Column label="Blueprint" name="blueprint_id" width="20%"
                                 show={fieldsToShow.indexOf("Blueprint") >= 0 && !this.props.data.blueprintId}/>
                    <DataTable.Column label="Deployment" name="deployment_id" width="20%"
                                 show={fieldsToShow.indexOf("Deployment") >= 0 && !this.props.data.deploymentId}/>
                    <DataTable.Column label="Workflow" name="workflow_id" width="15%"
                                 show={fieldsToShow.indexOf("Workflow") >= 0}/>
                    <DataTable.Column label="Id" name="id" width="15%"
                                 show={fieldsToShow.indexOf("Id") >= 0}/>
                    <DataTable.Column label="Created" name="created_at" width="10%"
                                 show={fieldsToShow.indexOf("Created") >= 0}/>
                    <DataTable.Column label="Creator" name='created_by' width="5%"
                                      show={fieldsToShow.indexOf("Creator") >= 0}/>
                    <DataTable.Column label="IsSystem" name="is_system_workflow" width="5%"
                                 show={fieldsToShow.indexOf("IsSystem") >= 0}/>
                    <DataTable.Column label="Params" name="parameters" width="5%"
                                 show={fieldsToShow.indexOf("Params") >= 0}/>
                    <DataTable.Column label="Status" width="5%" name="status"
                                 show={fieldsToShow.indexOf("Status") >= 0}/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <DataTable.Row key={item.id} selected={item.isSelected} onClick={this._selectExecution.bind(this,item)}>
                                    <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                    <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                    <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                    <DataTable.Data>{item.id}</DataTable.Data>
                                    <DataTable.Data>{item.created_at}</DataTable.Data>
                                    <DataTable.Data>{item.created_by}</DataTable.Data>
                                    <DataTable.Data><Checkmark value={item.is_system_workflow}/></DataTable.Data>
                                    <DataTable.Data>
                                        <Overlay>
                                            <Overlay.Action>
                                                <i data-overlay-action className="options icon link bordered" title="Execution parameters"></i>
                                            </Overlay.Action>
                                            <Overlay.Content>
                                                <HighlightText className='json'>{JSON.stringify(item.parameters, null, 2)}</HighlightText>
                                            </Overlay.Content>
                                        </Overlay>
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        { _.isEmpty(item.error) ?
                                            <div>
                                                <i className="check circle icon inverted green"></i>
                                                <ExecutionStatus item={item} showInactiveAsLink={false} onCancelExecution={this._cancelExecution.bind(this)}/>
                                            </div>
                                            :
                                            <Overlay>
                                                <Overlay.Action title="Error details">
                                                    <i data-overlay-action className="remove circle icon red link"></i>
                                                    <ExecutionStatus item={item} showInactiveAsLink={true} onCancelExecution={this._cancelExecution.bind(this)}/>
                                                </Overlay.Action>
                                                <Overlay.Content>
                                                    <HighlightText className='python'>{item.error}</HighlightText>
                                                </Overlay.Content>
                                            </Overlay>
                                        }
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>

            </div>
        );
    }
}
