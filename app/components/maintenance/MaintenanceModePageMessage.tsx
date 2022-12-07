import i18n from 'i18next';
import React, { Component } from 'react';
import { HeaderBar } from 'cloudify-ui-components';

import Banner from '../banner/Banner';
import SystemStatusHeader from '../status/SystemStatusHeader';
import Consts from '../../utils/consts';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StatusPoller from '../../utils/StatusPoller';
import { Divider, Header, FullScreenSegment, MessageContainer } from '../basic';
import { ClusterServicesList, MaintenanceModeActivationButton, MaintenanceModeModal } from '../shared';

export interface MaintenanceModePageMessageProps {
    canMaintenanceMode: boolean;
    isFetchingClusterStatus: boolean;
    maintenanceStatus: string;
    navigateToHome: () => void;
    onGetClusterStatus: () => void;
    showServicesStatus: boolean;
}

export interface MaintenanceModePageMessageState {
    showMaintenanceModal: boolean;
}

export default class MaintenanceModePageMessage extends Component<
    MaintenanceModePageMessageProps,
    MaintenanceModePageMessageState
> {
    constructor(props: MaintenanceModePageMessageProps, context: Record<string, any>) {
        super(props, context);

        this.state = {
            showMaintenanceModal: false
        };
    }

    componentDidMount() {
        const { onGetClusterStatus } = this.props;
        StatusPoller.getPoller()?.start();
        onGetClusterStatus();
    }

    componentDidUpdate() {
        const { maintenanceStatus, navigateToHome } = this.props;
        if (maintenanceStatus !== Consts.MAINTENANCE_ACTIVATED) {
            navigateToHome();
        }
    }

    componentWillUnmount() {
        StatusPoller.getPoller()?.stop();
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
                    <Header as="h2">{i18n.t('maintenanceMode.header', 'Maintenance mode')}</Header>

                    <p>
                        {i18n.t(
                            'maintenanceMode.message',
                            'Server is on maintenance mode and is not available at the moment.'
                        )}
                    </p>

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
