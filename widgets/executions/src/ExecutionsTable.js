/**
 * Created by kinneretzin on 20/10/2016.
 */
import UpdateDetailsModal from './UpdateDetailsModal';

export default class extends React.Component {
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

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Executions available. Probably there\'s no deployment created, yet.';
        let {Checkmark, CopyToClipboardButton, DataTable, ErrorMessage, HighlightText, Icon, Modal, Popup} = Stage.Basic;
        let {ExecutionStatus, IdPopup} = Stage.Common;

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
                                 show={fieldsToShow.indexOf('Blueprint') >= 0 && !this.props.data.blueprintId}/>
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
                    <DataTable.Column label="System" name="is_system_workflow" width="5%"
                                 show={fieldsToShow.indexOf('System') >= 0}/>
                    <DataTable.Column label="Params" name="parameters" width="5%"
                                 show={fieldsToShow.indexOf('Params') >= 0}/>
                    <DataTable.Column label="Status" width="10%" name="status"
                                 show={fieldsToShow.indexOf('Status') >= 0}/>

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
                                        <Checkmark value={item.is_system_workflow}/>
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <Icon name="options" link bordered title="Execution parameters" onClick={(event)=>{event.stopPropagation();this.setState({execution: item, executionParametersModalOpen: true})}} />
                                        {
                                            item.workflow_id === 'update' && <Icon name="magnify" link bordered title="Update details" onClick={(event)=>{event.stopPropagation();this.setState({deploymentUpdateId: item.parameters.update_id, deploymentUpdateModalOpen: true})}} />
                                        }
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        {
                                            _.isEmpty(item.error)
                                            ?
                                                <div>
                                                    <Icon name="check circle" color="green" inverted />
                                                    <ExecutionStatus item={item} showInactiveAsLink={false} onCancelExecution={this._cancelExecution.bind(this)}/>
                                                </div>
                                            :
                                                <Popup position='top center'>
                                                    <Popup.Trigger>
                                                        <div onClick={(event)=>{event.stopPropagation();this.setState({execution: item, errorModalOpen: true})}} >
                                                            <Icon name="remove circle" color="red" link />
                                                            <ExecutionStatus item={item} showInactiveAsLink={true} onCancelExecution={this._cancelExecution.bind(this)} />
                                                        </div>
                                                    </Popup.Trigger>
                                                    <Popup.Content>
                                                        Click to see details
                                                    </Popup.Content>
                                                </Popup>
                                        }
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>

                <Modal open={this.state.executionParametersModalOpen} closeIcon
                       onClose={()=>this.setState({execution: null, executionParametersModalOpen: false})}>
                    <Modal.Content scrolling>
                        <HighlightText className='json'>{executionParameters}</HighlightText>
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content='Copy Parameters' text={executionParameters} />
                    </Modal.Actions>
                </Modal>

                <UpdateDetailsModal open={this.state.deploymentUpdateModalOpen}
                                    deploymentUpdateId={this.state.deploymentUpdateId}
                                    onClose={()=>this.setState({execution: null, deploymentUpdateId: '', deploymentUpdateModalOpen: false})}
                                    toolbox={this.props.toolbox} />

                <Modal open={this.state.errorModalOpen} closeIcon
                       onClose={()=>this.setState({execution: null, errorModalOpen: false})}>
                    <Modal.Content scrolling>
                        <HighlightText className='python'>{execution.error}</HighlightText>
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content='Copy Error' text={execution.error} />
                    </Modal.Actions>
                </Modal>

            </div>
        );
    }
}
