/**
 * Created by pposel on 16/02/2017.
 */
import React, {Component, PropTypes} from "react";
import Consts from "../../utils/consts";
import {Modal, Icon, ErrorMessage, DataTable, Checkmark, ApproveButton, CancelButton} from "../basic/index";
import StageUtils from "../../utils/stageUtils";

const POLLING_INTERVAL = 2000;

export default class MaintenanceMode extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = MaintenanceMode.initialState;
        this.pollingTimeout = null;
    }

    static initialState = {
        loading: false,
        error: "",
    }

    static propTypes = {
        show: PropTypes.bool.isRequired,
        manager: PropTypes.object.isRequired,
        activeExecutions: PropTypes.object,
        onHide: PropTypes.func.isRequired,
        onMaintenanceActivate: PropTypes.func.isRequired,
        onMaintenanceDeactivate: PropTypes.func.isRequired,
        onFetchActiveExecutions: PropTypes.func.isRequired
    };

    static defaultProps = {
        activeExecutions: {}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState(MaintenanceMode.initialState);

            this._loadPendingExecutions();
        } else if (this.props.show && !nextProps.show) {
            console.log("Stop polling maintenance data");
            this._stopPolling();
            this.props.onClose();
        }
    }

    _loadPendingExecutions() {
        if (this.props.manager.maintenance !== Consts.MAINTENANCE_DEACTIVATED) {
            return;
        }

        this.fetchDataPromise = StageUtils.makeCancelable(this.props.onFetchActiveExecutions());
        this.fetchDataPromise.promise.then((data)=>{
            console.log("Maintenance data fetched");
            this._startPolling();
        }).catch((err)=>{
            this.setState({error:err.message});
            this._startPolling();
        });
    }

    _stopPolling() {
        clearTimeout(this.pollingTimeout);

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }
    }

    _startPolling() {
        this._stopPolling();

        if (this.props.show) {
            console.log(`Polling maintenance data - time interval: ${POLLING_INTERVAL / 1000} sec`);
            this.pollingTimeout = setTimeout(() => {this._loadPendingExecutions()}, POLLING_INTERVAL);
        }

    }

    onApprove () {
        this.setState({loading:true});

        if (this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED) {
            this._activate();
        } else {
            this._deactivate();
        }

        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _activate() {
        this.props.onMaintenanceActivate().then(()=>{
            this.setState({error:"", loading:false});
            this.props.onHide();
        }).catch((err)=>{
            this.setState({error:err.message, loading:false});
        });
    }

    _deactivate() {
        this.props.onMaintenanceDeactivate().then(()=>{
            this.setState({error:"", loading:false});
            this.props.onHide();
        }).catch((err)=>{
            this.setState({error:err.message, loading:false});
        });
    }

    _cancelExecution(execution, action) {
        this.props.onCancelExecution(execution, action).then(() => {
            this._loadPendingExecutions();
            this.setState({error:""});
        }).catch((err) => {
            this.setState({error:err.message});
        });
    }

    render() {

        return (
            <Modal open={this.props.show}>
                <Modal.Header>
                    <Icon name="doctor"/>
                    {
                        this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED?
                            'Are you sure you want to enter maintenance mode?':
                            'Are you sure you want to exit maintenance mode?'

                    }
                </Modal.Header>

                {
                    (this.state.error || !_.isEmpty(this.props.activeExecutions.items)) ?
                    <Modal.Content>
                        <ErrorMessage error={this.state.error}/>

                        {!_.isEmpty(this.props.activeExecutions.items) &&
                            <DataTable>
                                <DataTable.Column label="Blueprint" width="20%"/>
                                <DataTable.Column label="Deployment" width="20%"/>
                                <DataTable.Column label="Workflow" width="20%"/>
                                <DataTable.Column label="Id" width="20%"/>
                                <DataTable.Column label="IsSystem" width="5%"/>
                                <DataTable.Column label="Status" width="15%"/>

                                {
                                    this.props.activeExecutions.items.map((item) => {
                                        return (
                                            <DataTable.Row key={item.id}>
                                                <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                                <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                                <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                                <DataTable.Data>{item.id}</DataTable.Data>
                                                <DataTable.Data><Checkmark value={item.is_system_workflow}/></DataTable.Data>
                                                <DataTable.Data>
                                                    <Stage.Common.ExecutionStatus item={item} onCancelExecution={this._cancelExecution.bind(this)}/>
                                                </DataTable.Data>
                                            </DataTable.Row>
                                        );
                                    })
                                }
                            </DataTable>
                        }

                    </Modal.Content> : ""
                }


                <Modal.Actions>
                    <CancelButton onClick={this.onDeny.bind(this)} content="No" disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} content="Yes" icon="doctor" color="green" disabled={this.state.loading} />
                </Modal.Actions>
            </Modal>
        )
    }
}