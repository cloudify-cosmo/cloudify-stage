/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import Tenants from '../../containers/Tenants';
import Manager from '../../containers/Manager';
import Users from '../../containers/Users';
import {Confirm} from '../basic';
import MaintenanceMessage from '../../containers/maintenance/MaintenanceMessage';
import MaintenanceMode from '../../containers/maintenance/MaintenanceMode';
import ConfigureModal from '../../containers/ConfigureModal';
import Consts from '../../utils/consts';

export default class Header extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showMaintenanceModal: false,
            showConfigureModal: false,
            showResetConfirm: false
        }
    }

    static propTypes = {
        manager: PropTypes.any.isRequired,
        mode: PropTypes.string.isRequired,
        onResetTemplate: PropTypes.func.isRequired
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.manager, nextProps.manager) || this.state != nextState;
    }

    render() {
        let isModeMain = this.props.mode === Consts.MODE_MAIN;

        return (
            <div className="ui top fixed menu inverted secondary headerBar">
                <div className="logo">
                </div>
                {
                    isModeMain
                    ?
                    <div className="right menu">
                        <div className='item'>
                            <Manager manager={this.props.manager}/>
                        </div>

                        <Tenants manager={this.props.manager}/>

                        <Users manager={this.props.manager}
                               showAllOptions={true}
                               onMaintenance={()=> this.setState({showMaintenanceModal: true})}
                               onConfigure={()=> this.setState({showConfigureModal: true})}
                               onReset={()=> this.setState({showResetConfirm: true})}/>
                    </div>
                    :
                    <div className="right menu">
                        <Users manager={this.props.manager} showAllOptions={false}/>
                    </div>
                }

                <MaintenanceMessage manager={this.props.manager}/>
                <MaintenanceMode show={this.state.showMaintenanceModal}
                                 onHide={()=> this.setState({showMaintenanceModal: false})}/>
                <ConfigureModal show={this.state.showConfigureModal}
                                onHide={()=> this.setState({showConfigureModal: false})}/>
                <Confirm content={'Are you sure you want to reset application screens to default?'}
                         open={this.state.showResetConfirm}
                         onConfirm={()=>{this.setState({showResetConfirm: false}); this.props.onResetTemplate()}}
                         onCancel={()=>this.setState({showResetConfirm: false})} />
            </div>
        );
    }
}