import i18n from 'i18next';
import React, { useEffect } from 'react';
import { HeaderBar } from 'cloudify-ui-components';

import Banner from '../banner/Banner';
import SystemStatusHeader from '../status/SystemStatusHeader';
import Consts from '../../utils/consts';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StatusPoller from '../../utils/StatusPoller';
import { Divider, Header, FullScreenSegment, MessageContainer } from '../basic';
import { ClusterServicesList, MaintenanceModeActivationButton, MaintenanceModeModal } from '../shared';
import { useBoolean } from '../../utils/hooks';

export interface MaintenanceModePageMessageProps {
    canMaintenanceMode: boolean;
    isFetchingClusterStatus: boolean;
    maintenanceStatus: string;
    navigateToHome: () => void;
    onGetClusterStatus: () => void;
    showServicesStatus: boolean;
}

export default function MaintenanceModePageMessage({
    onGetClusterStatus,
    canMaintenanceMode,
    isFetchingClusterStatus,
    showServicesStatus,
    maintenanceStatus,
    navigateToHome
}: MaintenanceModePageMessageProps) {
    const [maintenanceModalVisible, showMaintenanceModal, hideMaintenanceModal] = useBoolean(false);

    useEffect(() => {
        StatusPoller.getPoller()!.start();
        onGetClusterStatus();

        return () => {
            StatusPoller.getPoller()?.stop();
        };
    }, []);

    useEffect(() => {
        if (maintenanceStatus !== Consts.MAINTENANCE_ACTIVATED) {
            navigateToHome();
        }
    }, [maintenanceStatus, navigateToHome]);

    SplashLoadingScreen.turnOff();

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
                    <MaintenanceModeActivationButton activate={false} onClick={showMaintenanceModal} />
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
                <MaintenanceModeModal show={maintenanceModalVisible} onHide={hideMaintenanceModal} />
            )}
        </FullScreenSegment>
    );
}
