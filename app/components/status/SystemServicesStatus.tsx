import React from 'react';
import { connect } from 'react-redux';
import { mapValues } from 'lodash';
import SystemStatusHeader from './SystemStatusHeader';
import { Table } from '../basic';
import ClusterStatusOverview from '../shared/cluster/ClusterServicesOverview';
import { clusterServiceEnum } from '../shared/cluster/consts';
import { ClusterServiceStatus } from '../shared/cluster/types';
import { getClusterStatus } from '../../actions/manager/clusterStatus';
import type { ClusterServices, ClusterServiceData } from '../shared/cluster/types';
import type { ReduxState } from '../../reducers';
import type { ReduxThunkDispatch } from '../../configureStore';

const defaultServices = mapValues(clusterServiceEnum, () => {
    const clusterServiceData: ClusterServiceData = {
        status: ClusterServiceStatus.Unknown,
        is_external: false
    };
    return clusterServiceData;
});

export interface SystemServicesStatusProps {
    services?: ClusterServices;
    isFetching?: boolean;
    fetchingError?: string;
}

function SystemServicesStatus({
    services = defaultServices,
    isFetching = false,
    fetchingError = ''
}: SystemServicesStatusProps) {
    return (
        <ClusterStatusOverview
            clickable
            services={services}
            isFetching={isFetching}
            fetchingError={fetchingError}
            header={
                <Table.Row>
                    <Table.HeaderCell colSpan="2">
                        <SystemStatusHeader />
                    </Table.HeaderCell>
                </Table.Row>
            }
        />
    );
}

const mapStateToProps = (state: ReduxState) => {
    const { services, isFetching, error: fetchingError } = state.manager.clusterStatus;
    return { services, isFetching, fetchingError };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        onStatusRefresh: () => {
            dispatch(getClusterStatus());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemServicesStatus);
