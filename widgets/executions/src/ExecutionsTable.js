/**
 * Created by kinneretzin on 20/10/2016.
 */

import Actions from './actions';
import ExecutionStatus from '../../deployments/src/ExecutionStatus';

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        };
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

    _cancelExecution(execution) {
        let actions = new Actions(this.props.toolbox);
        actions.doCancel(execution, false)
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
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Table = Stage.Basic.Table;
        var HighlightText = Stage.Basic.HighlightText;
        var Overlay = Stage.Basic.Overlay;
        var Checkmark = Stage.Basic.Checkmark;

        var fieldsToShow = this.props.widget.configuration.fieldsToShow;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.configuration.pageSize}
                            selectable={true}
                            className="executionsTable">

                    <Table.Column label="Blueprint" name="blueprint_id" width="20%"
                                 show={fieldsToShow.indexOf("Blueprint") >= 0 && !this.props.data.blueprintId}/>
                    <Table.Column label="Deployment" name="deployment_id" width="20%"
                                 show={fieldsToShow.indexOf("Deployment") >= 0 && !this.props.data.deploymentId}/>
                    <Table.Column label="Workflow" name="workflow_id" width="10%"
                                 show={fieldsToShow.indexOf("Workflow") >= 0}/>
                    <Table.Column label="Id" name="id" width="20%"
                                 show={fieldsToShow.indexOf("Id") >= 0}/>
                    <Table.Column label="Created" name="created_at" width="10%"
                                 show={fieldsToShow.indexOf("Created") >= 0}/>
                    <Table.Column label="IsSystem" name="is_system_workflow" width="5%"
                                 show={fieldsToShow.indexOf("IsSystem") >= 0}/>
                    <Table.Column label="Params" name="parameters" width="5%"
                                 show={fieldsToShow.indexOf("Params") >= 0}/>
                    <Table.Column label="Status" width="10%" name="status"
                                 show={fieldsToShow.indexOf("Status") >= 0}/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Table.Row key={item.id} selected={item.isSelected} onClick={this._selectExecution.bind(this,item)}>
                                    <Table.Data>{item.blueprint_id}</Table.Data>
                                    <Table.Data>{item.deployment_id}</Table.Data>
                                    <Table.Data>{item.workflow_id}</Table.Data>
                                    <Table.Data>{item.id}</Table.Data>
                                    <Table.Data>{item.created_at}</Table.Data>
                                    <Table.Data><Checkmark value={item.is_system_workflow}/></Table.Data>
                                    <Table.Data>
                                        <Overlay>
                                            <Overlay.Action>
                                                <i data-overlay-action className="options icon link bordered" title="Execution parameters"></i>
                                            </Overlay.Action>
                                            <Overlay.Content>
                                                <HighlightText className='json'>{JSON.stringify(item.parameters, null, 2)}</HighlightText>
                                            </Overlay.Content>
                                        </Overlay>
                                    </Table.Data>
                                    <Table.Data>
                                        { _.isEmpty(item.error) ?
                                            <div>
                                                <i className="check circle icon inverted green"></i>
                                                <ExecutionStatus item={item} showInactive={true} showWorkflowId={false} onCancelExecution={this._cancelExecution.bind(this,item)}/>
                                            </div>
                                            :
                                            <Overlay>
                                                <Overlay.Action title="Error details">
                                                    <i data-overlay-action className="remove circle icon red link"></i>
                                                    <ExecutionStatus item={item} showInactive={true} showInactiveAsLink={true} showWorkflowId={false} onCancelExecution={this._cancelExecution.bind(this,item)}/>
                                                </Overlay.Action>
                                                <Overlay.Content>
                                                    <HighlightText className='python'>{item.error}</HighlightText>
                                                </Overlay.Content>
                                            </Overlay>
                                        }
                                    </Table.Data>
                                </Table.Row>
                            );
                        })
                    }
                </Table>

            </div>
        );
    }
}
