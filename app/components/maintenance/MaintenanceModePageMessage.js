/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Services from '../../containers/Services';
import Banner from '../../containers/banner/Banner';
import Consts from '../../utils/consts';
import StatusPoller from '../../utils/StatusPoller';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import FullScreenSegment from '../layout/FullScreenSegment';
import {Divider, Header, MaintenanceModeActivationButton, MaintenanceModeModal, MessageContainer} from '../basic';

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

        return (
            <FullScreenSegment>
                <Banner />

                <MessageContainer wide>
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

            </FullScreenSegment>
        );
    }
}
