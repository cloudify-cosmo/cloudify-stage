/**
 * Created by kinneretzin on 20/10/2016.
 */

import SystemWorkflowIcon from './SystemWorkflowIcon';
import DryRunIcon from './DryRunIcon';

export default class ExecutionsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            execution: null,
            errorModalOpen: false,
            executionParametersModalOpen: false,
            deploymentUpdateModalOpen: false,
            hoveredExecution: null,
            deploymentUpdateId: '',
            error: null
        };
    }

    static MenuAction = {
        SHOW_EXECUTION_PARAMETERS: 'execution_parameters',
        SHOW_UPDATE_DETAILS: 'update_details',
        SHOW_ERROR_DETAILS: 'error_details',
        CANCEL_EXECUTION: Stage.Common.ExecutionUtils.CANCEL_ACTION,
        FORCE_CANCEL_EXECUTION: Stage.Common.ExecutionUtils.FORCE_CANCEL_ACTION,
        KILL_CANCEL_EXECUTION: Stage.Common.ExecutionUtils.KILL_CANCEL_ACTION
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget.configuration, nextProps.widget.configuration)
            || !_.isEqual(this.state, nextState)
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
        let oldSelectedExecutionId = this.props.toolbox.getContext().getValue('executionId');
        this.props.toolbox.getContext().setValue('executionId',item.id === oldSelectedExecutionId ? null : item.id);
        if (item.id === oldSelectedExecutionId) {
            this.props.toolbox.getContext().setValue('executionId', null);
        } else {
            this.props.toolbox.getContext().setValue('executionId', item.id);
        }
    }

    _cancelExecution(execution, action) {
        let actions = new Stage.Common.ExecutionActions(this.props.toolbox);
        actions.doCancel(execution, action)
            .then(() => {
                this.setState({error: null});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.toolbox.getEventBus().trigger('executions:refresh');
            })
            .catch((err) => {this.setState({error: err.message});});
    }

    _actionClick(execution, proxy, {name}) {
        const MenuAction = ExecutionsTable.MenuAction;

        switch(name) {
            case MenuAction.SHOW_EXECUTION_PARAMETERS:
                this.setState({execution, executionParametersModalOpen: true, idPopupOpen: false});
                break;

            case MenuAction.SHOW_UPDATE_DETAILS:
                this.setState({deploymentUpdateId: execution.parameters.update_id, deploymentUpdateModalOpen: true});
                break;

            case MenuAction.SHOW_ERROR_DETAILS:
                this.setState({execution, errorModalOpen: true, idPopupOpen: false});
                break;

            case MenuAction.CANCEL_EXECUTION:
            case MenuAction.FORCE_CANCEL_EXECUTION:
            case MenuAction.KILL_CANCEL_EXECUTION:
                this._cancelExecution(execution, name);
                break;
        }
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Executions available. Probably there\'s no deployment created, yet.';
        let {CancelButton, CopyToClipboardButton, DataTable, ErrorMessage, HighlightText, Icon, Menu, Modal, PopupMenu} = Stage.Basic;
        let {ExecutionStatus, ExecutionUtils, IdPopup, UpdateDetailsModal} = Stage.Common;
        const MenuAction = ExecutionsTable.MenuAction;

        let fieldsToShow = this.props.widget.configuration.fieldsToShow;
        let execution = this.state.execution || {parameters: {}};
        let executionParameters = JSON.stringify(execution.parameters, null, 2);

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className="executionsTable"
                           noDataMessage={NO_DATA_MESSAGE}>

                    <DataTable.Column label="" width="1%" />
                    <DataTable.Column label="Blueprint" name="blueprint_id" width="15%"
                                      show={fieldsToShow.indexOf('Blueprint') >= 0 && !this.props.data.blueprintId && !this.props.data.deploymentId}/>
                    <DataTable.Column label="Deployment" name="deployment_id" width="15%"
                                      show={fieldsToShow.indexOf('Deployment') >= 0 && !this.props.data.deploymentId}/>
                    <DataTable.Column label="Workflow" name="workflow_id" width="15%"
                                      show={fieldsToShow.indexOf('Workflow') >= 0}/>
                    <DataTable.Column label="Id" name="id" width="10%"
                                      show={fieldsToShow.indexOf('Id') >= 0}/>
                    <DataTable.Column label="Created" name="created_at" width="10%"
                                      show={fieldsToShow.indexOf('Created') >= 0}/>
                    <DataTable.Column label="Ended" name="ended_at" width="10%"
                                      show={fieldsToShow.indexOf('Ended') >= 0}/>
                    <DataTable.Column label="Creator" name='created_by' width="5%"
                                      show={fieldsToShow.indexOf('Creator') >= 0}/>
                    <DataTable.Column label="Attributes" width="5%"
                                      show={fieldsToShow.indexOf('System') >= 0 || fieldsToShow.indexOf('Attributes') >= 0}/>
                    <DataTable.Column label="Status" width="15%"
                                      show={fieldsToShow.indexOf('Status') >= 0}/>
                    <DataTable.Column width="5%"
                                      show={fieldsToShow.indexOf('Params') >= 0 || fieldsToShow.indexOf('Actions') >= 0}/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <DataTable.Row key={item.id} selected={item.isSelected} onClick={this._selectExecution.bind(this,item)}
                                               onMouseOver={() => this.state.hoveredExecution !== item.id && this.setState({hoveredExecution: item.id})}
                                               onMouseOut={() =>  this.state.hoveredExecution === item.id && this.setState({hoveredExecution: null})}>
                                    <DataTable.Data>
                                        <IdPopup id={item.id} selected={this.state.hoveredExecution === item.id} />
                                    </DataTable.Data>
                                    <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                    <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                    <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                    <DataTable.Data>{item.id}</DataTable.Data>
                                    <DataTable.Data>{item.created_at}</DataTable.Data>
                                    <DataTable.Data>{item.ended_at}</DataTable.Data>
                                    <DataTable.Data>{item.created_by}</DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <SystemWorkflowIcon execution={item} />
                                        <DryRunIcon execution={item} />
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <ExecutionStatus item={item} />
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">

                                        <PopupMenu className="menuAction">
                                            <Menu pointing vertical>
                                                <Menu.Item content='Show Execution Parameters'
                                                           icon='options'
                                                           name={MenuAction.SHOW_EXECUTION_PARAMETERS}
                                                           onClick={this._actionClick.bind(this, item)} />
                                                {
                                                    ExecutionUtils.isUpdateExecution(item) &&
                                                    <Menu.Item content='Show Update Details'
                                                               icon='magnify'
                                                               name={MenuAction.SHOW_UPDATE_DETAILS}
                                                               onClick={this._actionClick.bind(this, item)} />
                                                }
                                                {
                                                    ExecutionUtils.isFailedExecution(item) &&
                                                    <Menu.Item content='Show Error Details'
                                                               icon={<Icon name='exclamation circle' color='red' />}
                                                               name={MenuAction.SHOW_ERROR_DETAILS}
                                                               onClick={this._actionClick.bind(this, item)} />
                                                }
                                                {
                                                    ExecutionUtils.isActiveExecution(item) &&
                                                    <Menu.Item content='Cancel'
                                                               icon='cancel'
                                                               name={MenuAction.CANCEL_EXECUTION}
                                                               onClick={this._actionClick.bind(this, item)} />
                                                }
                                                {
                                                    ExecutionUtils.isActiveExecution(item) &&
                                                    <Menu.Item content='Force Cancel'
                                                               icon={<Icon name='cancel' color='red' />}
                                                               name={MenuAction.FORCE_CANCEL_EXECUTION}
                                                               onClick={this._actionClick.bind(this, item)}/>
                                                }
                                                <Menu.Item content='Kill Cancel'
                                                           icon={<Icon name='stop' color='red' />}
                                                           name={MenuAction.KILL_CANCEL_EXECUTION}
                                                           onClick={this._actionClick.bind(this, item)} />
                                            </Menu>
                                        </PopupMenu>
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>

                <Modal open={this.state.executionParametersModalOpen}
                       onClose={()=>this.setState({execution: null, executionParametersModalOpen: false})}>
                    <Modal.Content scrolling>
                        <HighlightText className='json'>{executionParameters}</HighlightText>
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content='Copy Parameters' text={executionParameters} />
                        <CancelButton onClick={(e) => {e.stopPropagation(); this.setState({executionParametersModalOpen: false})}}
                                      content="Close" />
                    </Modal.Actions>
                </Modal>

                <UpdateDetailsModal open={this.state.deploymentUpdateModalOpen}
                                    deploymentUpdateId={this.state.deploymentUpdateId}
                                    onClose={()=>this.setState({execution: null, deploymentUpdateId: '', deploymentUpdateModalOpen: false})}
                                    toolbox={this.props.toolbox} />

                <Modal open={this.state.errorModalOpen}
                       onClose={()=>this.setState({execution: null, errorModalOpen: false})}>
                    <Modal.Content scrolling>
                        <HighlightText className='python'>{execution.error}</HighlightText>
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content='Copy Error' text={execution.error} />
                        <CancelButton onClick={(e) => {e.stopPropagation(); this.setState({errorModalOpen: false})}}
                                      content="Close" />
                    </Modal.Actions>
                </Modal>

            </div>
        );
    }
}
