/**
 * Created by pposel on 16/02/2017.
 */
import React, {Component, PropTypes} from "react";
import {setStatus} from "../../actions/managers";
import Consts from "../../utils/consts";
import {Modal, Icon, ErrorMessage, DataTable, Checkmark} from "../basic/index";
import Actions from "./actions";
import ExecutionStatus from "./ExecutionStatus";
import StageUtils from "../../utils/stageUtils";
import { connect } from 'react-redux';

const POLLING_INTERVAL = 2000;

class MaintenanceMode extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = MaintenanceMode.initialState;
        this.pollingTimeout = null;
    }

    static initialState = {
        loading: false,
        error: "",
        activeExecutions : {}
    }

    static propTypes = {
        show: PropTypes.bool.isRequired,
        manager: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState(MaintenanceMode.initialState);

            this._loadPendingExecutions();
        } else if (this.props.show && !nextProps.show) {
            console.log("Stop polling maintenance data");
            this._stopPolling();
        }
    }

    _loadPendingExecutions() {
        if (this.props.manager.maintenance !== Consts.MAINTENANCE_DEACTIVATED) {
            return;
        }

        var actions = new Actions(this.props.manager);
        this.fetchDataPromise = StageUtils.makeCancelable(actions.doGetActiveExecutions());
        this.fetchDataPromise.promise.then((data)=>{
            console.log("Maintenance data fetched");

            this.setState({activeExecutions:data});
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
        var actions = new Actions(this.props.manager);
        actions.doActivateMaintenance().then((data)=>{
            this.setState({loading:false});
            this.props.onHide();
            this.props.onMaintenanceChange(data.status);
        }).catch((err)=>{
            this.setState({error:err.message, loading:false});
        });
    }

    _deactivate() {
        var actions = new Actions(this.props.manager);
        actions.doDeactivateMaintenance().then((data)=>{
            this.setState({loading:false});
            this.props.onHide();
            this.props.onMaintenanceChange(data.status);
        }).catch((err)=>{
            this.setState({error:err.message, loading:false});
        });
    }

    _cancelExecution(execution, action) {
        let actions = new Actions(this.props.manager);
        actions.doCancelExecution(execution, action).then(() => {
            this._loadPendingExecutions();
        }).catch((err) => {
            this.setState({error:err.message});
        });
    }

    render() {

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}
                   loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="doctor"/>
                    {
                        this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED?
                            'Are you sure you want to enter maintenance mode?':
                            'Are you sure you want to exit maintenance mode?'

                    }
                </Modal.Header>

                {
                    (this.state.error || !_.isEmpty(this.state.activeExecutions.items)) ?
                    <Modal.Body>
                        <ErrorMessage error={this.state.error}/>

                        {!_.isEmpty(this.state.activeExecutions.items) &&
                            <DataTable>
                                <DataTable.Column label="Blueprint" width="20%"/>
                                <DataTable.Column label="Deployment" width="20%"/>
                                <DataTable.Column label="Workflow" width="20%"/>
                                <DataTable.Column label="Id" width="20%"/>
                                <DataTable.Column label="IsSystem" width="5%"/>
                                <DataTable.Column label="Status" width="15%"/>

                                {
                                    this.state.activeExecutions.items.map((item) => {
                                        return (
                                            <DataTable.Row key={item.id}>
                                                <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                                <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                                <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                                <DataTable.Data>{item.id}</DataTable.Data>
                                                <DataTable.Data><Checkmark value={item.is_system_workflow}/></DataTable.Data>
                                                <DataTable.Data>
                                                    <ExecutionStatus item={item} onCancelExecution={this._cancelExecution.bind(this)}/>
                                                </DataTable.Data>
                                            </DataTable.Row>
                                        );
                                    })
                                }
                            </DataTable>
                        }

                    </Modal.Body> : ""
                }


                <Modal.Footer>
                    <Modal.Cancel label="No"/>
                    <Modal.Approve label="Yes" icon="doctor" className="green"/>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager,
        show: ownProps.show,
        onHide: ownProps.onHide
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMaintenanceChange: (status) => {
            dispatch(setStatus(ownProps.manager.status, status));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceMode);