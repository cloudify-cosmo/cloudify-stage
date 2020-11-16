/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HeaderBar } from 'cloudify-ui-components';

import Banner from '../banner/Banner';
import SystemStatusHeader from '../../containers/status/SystemStatusHeader';
import Consts from '../../utils/consts';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StatusPoller from '../../utils/StatusPoller';

import { Divider, Header, FullScreenSegment, MessageContainer } from '../basic';
import { ClusterServicesList, MaintenanceModeActivationButton, MaintenanceModeModal } from '../shared';

export default class MaintenanceModePageMessage extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showMaintenanceModal: false
        };
    }

    componentDidMount() {
        const { onGetClusterStatus } = this.props;
        StatusPoller.getPoller().start();
        onGetClusterStatus();
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
                <HeaderBar>
                    <Banner hideOnSmallScreen={false} />
                </HeaderBar>

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
