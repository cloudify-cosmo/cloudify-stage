import React from 'react';
import { useSelector } from 'react-redux';
import { mapValues } from 'lodash';
import SystemStatusHeader from './SystemStatusHeader';
import { Table } from '../basic';
import ClusterStatusOverview from '../shared/cluster/ClusterServicesOverview';
import { clusterServiceEnum } from '../shared/cluster/consts';
import { ClusterServiceStatus } from '../shared/cluster/types';
import type { ClusterServiceData } from '../shared/cluster/types';
import type { ReduxState } from '../../reducers';

const defaultServices = mapValues(clusterServiceEnum, () => {
    const clusterServiceData: ClusterServiceData = {
        status: ClusterServiceStatus.Unknown,
        is_external: false
    };
    return clusterServiceData;
});

export default function SystemServicesStatus() {
    const services = useSelector((state: ReduxState) => state.manager.clusterStatus.services ?? defaultServices);
    const isFetching = useSelector((state: ReduxState) => state.manager.clusterStatus.isFetching ?? false);
    const fetchingError = useSelector((state: ReduxState) => state.manager.clusterStatus.error ?? '');
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
