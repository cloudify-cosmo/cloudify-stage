import i18n from 'i18next';
import React, { useEffect } from 'react';
import { HeaderBar } from 'cloudify-ui-components';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import Banner from '../sidebar/banner/Banner';
import SystemStatusHeader from '../common/status/SystemStatusHeader';
import Consts from '../../utils/consts';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StatusPoller from '../../utils/StatusPoller';
import { Divider, Header, FullScreenSegment, MessageContainer } from '../basic';
import { ClusterServicesList, MaintenanceModeActivationButton, MaintenanceModeModal } from '../shared';
import { useBoolean } from '../../utils/hooks';
import type { ReduxState } from '../../reducers';
import StageUtils from '../../utils/stageUtils';
import { getClusterStatus } from '../../actions/manager/clusterStatus';

export default function MaintenanceModePage() {
    const isFetchingClusterStatus = useSelector((state: ReduxState) => state.manager.clusterStatus.isFetching);
    const maintenanceStatus = useSelector((state: ReduxState) => state.manager.maintenance);
    const maintenanceModePermitted = useSelector((state: ReduxState) =>
        StageUtils.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager)
    );
    const showServicesStatus = useSelector((state: ReduxState) =>
        StageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager)
    );
    const dispatch = useDispatch();
    const navigateToHome = () => dispatch(push(Consts.PAGE_PATH.HOME));
    const onGetClusterStatus = () => dispatch(getClusterStatus());

    const [maintenanceModalVisible, showMaintenanceModal, hideMaintenanceModal] = useBoolean(false);

    useEffect(() => {
        StatusPoller.getPoller().start();
        onGetClusterStatus();

        return () => {
            StatusPoller.getPoller()?.stop();
        };
    }, []);

    useEffect(() => {
        if (maintenanceStatus !== Consts.MAINTENANCE_ACTIVATED) {
            navigateToHome();
        }
    }, [maintenanceStatus]);

    SplashLoadingScreen.turnOff();

    return (
        <FullScreenSegment>
            <HeaderBar>
                <Banner hideOnSmallScreen={false} />
            </HeaderBar>

            <MessageContainer wide>
                <Header as="h2">{i18n.t('maintenanceMode.header')}</Header>

                <p>{i18n.t('maintenanceMode.message')}</p>

                {maintenanceModePermitted && (
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

            {maintenanceModePermitted && (
                <MaintenanceModeModal show={maintenanceModalVisible} onHide={hideMaintenanceModal} />
            )}
        </FullScreenSegment>
    );
}
