/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';
import MaintenanceMode from '../../containers/maintenance/MaintenanceMode';
import Consts from '../../utils/consts';
import StatusPoller from '../../utils/StatusPoller';

export default class MaintenanceModePageMessage extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            showMaintenanceModal: false
        }
    }

    static propTypes = {
        manager: PropTypes.object.isRequired
    };


    componentDidUpdate() {
        if (this.props.manager.maintenance !== Consts.MAINTENANCE_ACTIVATED) {
            this.props.navigateToHome();
        }
    }

    componentDidMount() {
        StatusPoller.getPoller().start();
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
    }

    render () {
        var {Label,Icon} = Stage.Basic;
        return (
            <div className='maintenancePage ui segment basic'>
                <div className="logo">
                    <img src={Stage.Utils.url('/app/images/Cloudify-logo.png')}/>
                </div>

                <div className="ui raised very padded text container segment center aligned maintenanceContainer">

                    <h2 className="ui header">Maintenance mode</h2>
                    <p>Server is on maintenance mode and is not available at the moment.</p>

                    {
                        this.props.manager.auth.role === Consts.ROLE_ADMIN &&
                        <Label as='a' onClick={()=> this.setState({showMaintenanceModal: true})}>
                            <Icon name='doctor'/>
                            Deactivate maintenance mode
                        </Label>

                    }
                </div>

                {
                    this.props.manager.auth.role === Consts.ROLE_ADMIN &&
                    <MaintenanceMode show={this.state.showMaintenanceModal}
                                     onHide={()=> this.setState({showMaintenanceModal: false})}/>

                }

            </div>
        );
    }
}
