/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import MaintenanceModeModal from '../basic/maintenance/MaintenanceModeModal';
import MessageContainer from '../MessageContainer';
import Services from '../../containers/Services';
import Logo from '../../containers/Logo';
import Consts from '../../utils/consts';
import StatusPoller from '../../utils/StatusPoller';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

export default class MaintenanceModePageMessage extends Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            showMaintenanceModal: false
        }
    }

    static propTypes = {
        manager: PropTypes.object.isRequired,
        canMaintenanceMode: PropTypes.bool.isRequired,
        showServicesStatus: PropTypes.bool.isRequired,
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
        SplashLoadingScreen.turnOff();

        let {Divider, Header, MaintenanceModeActivationButton} = Stage.Basic;

        return (
            <div className='maintenancePage ui segment basic'>
                <Logo />

                <MessageContainer className='maintenanceContainer'>
                    <Header as='h2'>Maintenance mode</Header>

                    <p>Server is on maintenance mode and is not available at the moment.</p>

                    {
                        this.props.canMaintenanceMode &&
                        <MaintenanceModeActivationButton activate={false} onClick={()=> this.setState({showMaintenanceModal: true})} />
                    }

                    {
                        this.props.showServicesStatus &&
                        <div>
                            <Divider />
                            <Services />
                        </div>
                    }
                </MessageContainer>

                {
                    this.props.canMaintenanceMode &&
                    <MaintenanceModeModal show={this.state.showMaintenanceModal}
                                          onHide={()=> this.setState({showMaintenanceModal: false})} />

                }

            </div>
        );
    }
}
