/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Divider, Header } from '../basic';
import {
    ClusterServicesList,
    MaintenanceModeActivationButton,
    MaintenanceModeModal,
    MessageContainer
} from '../shared';
import Banner from '../../containers/banner/Banner';
import Consts from '../../utils/consts';
import FullScreenSegment from '../layout/FullScreenSegment';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StatusPoller from '../../utils/StatusPoller';
import SystemStatusHeader from '../../containers/status/SystemStatusHeader';

export default class MaintenanceModePageMessage extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showMaintenanceModal: false
        };
    }

    componentDidMount() {
        StatusPoller.getPoller().start();
        this.props.onGetClusterStatus();
    }

    componentDidUpdate() {
        const { maintenanceStatus, navigateToHome } = this.props;
        if (maintenanceStatus !== Consts.MAINTENANCE_ACTIVATED) {
            navigateToHome();
        }
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
    }

    render() {
        SplashLoadingScreen.turnOff();

        const { canMaintenanceMode, isFetchingClusterStatus, showServicesStatus } = this.props;
        const { showMaintenanceModal } = this.state;

        return (
            <FullScreenSegment>
                <Banner />

                <MessageContainer wide>
                    <Header as="h2">Maintenance mode</Header>

                    <p>Server is on maintenance mode and is not available at the moment.</p>

                    {canMaintenanceMode && (
                        <MaintenanceModeActivationButton
                            activate={false}
                            onClick={() => this.setState({ showMaintenanceModal: true })}
                        />
                    )}

                    {showServicesStatus && (
                        <div style={{ fontSize: '1rem' }}>
                            <Divider />
                            <SystemStatusHeader />

                            {!isFetchingClusterStatus && <ClusterServicesList />}
                        </div>
                    )}
                </MessageContainer>

                {canMaintenanceMode && (
                    <MaintenanceModeModal
                        show={showMaintenanceModal}
                        onHide={() => this.setState({ showMaintenanceModal: false })}
                    />
                )}
            </FullScreenSegment>
        );
    }
}

MaintenanceModePageMessage.propTypes = {
    canMaintenanceMode: PropTypes.bool.isRequired,
    isFetchingClusterStatus: PropTypes.bool.isRequired,
    maintenanceStatus: PropTypes.string.isRequired,
    navigateToHome: PropTypes.func.isRequired,
    onGetClusterStatus: PropTypes.func.isRequired,
    showServicesStatus: PropTypes.bool.isRequired
};
