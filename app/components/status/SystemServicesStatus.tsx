import _ from 'lodash';
import React from 'react';

import SystemStatusHeader from '../../containers/status/SystemStatusHeader';
import { Table } from '../basic';
import ClusterStatusOverview from '../shared/cluster/ClusterServicesOverview';
import { clusterServiceEnum } from '../shared/cluster/consts';
import { ClusterServiceStatus } from '../shared/cluster/types';
import type { ClusterServices, ClusterServiceData } from '../shared/cluster/types';

const defaultServices = _.mapValues(clusterServiceEnum, () => {
    const clusterServiceData: ClusterServiceData = {
        status: ClusterServiceStatus.Unknown,
        is_external: false
    };
    return clusterServiceData;
});

export interface SystemServicesStatusProps {
    services: ClusterServices;
    isFetching: boolean;
    fetchingError: string;
}

export default function SystemServicesStatus({
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
