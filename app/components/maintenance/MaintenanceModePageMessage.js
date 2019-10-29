/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import Banner from '../../containers/banner/Banner';
import Consts from '../../utils/consts';
import StatusPoller from '../../utils/StatusPoller';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import FullScreenSegment from '../layout/FullScreenSegment';
import { Divider, Header, MaintenanceModeActivationButton, MaintenanceModeModal, MessageContainer } from '../basic';
import ClusterServicesList from '../basic/cluster/ClusterServicesList';
import StageUtils from '../../utils/stageUtils';

export default class MaintenanceModePageMessage extends Component {
    static propTypes = {
        /* FIXME: During CY-1514 add proper propTypes */
        manager: PropTypes.object.isRequired,
        canMaintenanceMode: PropTypes.bool.isRequired,
        showServicesStatus: PropTypes.bool.isRequired,
        onGetClusterStatus: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            showMaintenanceModal: false
        };
        this.toolbox = StageUtils.getToolbox(() => {}, () => {}, null);
    }

    componentDidMount() {
        StatusPoller.getPoller().start();
        this.props.onGetClusterStatus();
    }

    componentDidUpdate() {
        if (this.props.manager.maintenance !== Consts.MAINTENANCE_ACTIVATED) {
            this.props.navigateToHome();
        }
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
    }

    render() {
        SplashLoadingScreen.turnOff();

        const { canMaintenanceMode, showServicesStatus, manager, onGetClusterStatus } = this.props;
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
                            {/* TODO: Create separate component during CY-1514 */}
                            <div style={{ marginBottom: 10 }}>
                                <Header
                                    as="h3"
                                    style={{
                                        display: 'inline-block',
                                        marginBottom: 0,
                                        marginRight: 5,
                                        verticalAlign: 'middle'
                                    }}
                                >
                                    System Status
                                </Header>
                                <Button
                                    onClick={onGetClusterStatus}
                                    loading={manager.clusterStatus.isFetching}
                                    disabled={manager.clusterStatus.isFetching}
                                    circular
                                    icon="refresh"
                                    size="tiny"
                                />
                            </div>

                            {!manager.clusterStatus.isFetching && (
                                <ClusterServicesList services={manager.clusterStatus.services} toolbox={this.toolbox} />
                            )}
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
