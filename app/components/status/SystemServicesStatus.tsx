// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import SystemStatusHeader from '../../containers/status/SystemStatusHeader';
import { Table } from '../basic';
import ClusterStatusOverview from '../shared/cluster/ClusterServicesOverview';
import { clusterServiceEnum, clusterServiceStatuses } from '../shared/cluster/consts';
import { ClusterServiceStatus } from '../shared/cluster/types';

export default function SystemServicesStatus({ services, isFetching, fetchingError }) {
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

SystemServicesStatus.propTypes = {
    services: PropTypes.shape(
        _.mapValues(clusterServiceEnum, () =>
            PropTypes.shape({
                status: PropTypes.oneOf(clusterServiceStatuses),
                is_external: PropTypes.bool
            })
        )
    ),
    isFetching: PropTypes.bool,
    fetchingError: PropTypes.string
};

SystemServicesStatus.defaultProps = {
    services: _.mapValues(clusterServiceEnum, () => ({ status: ClusterServiceStatus.Unknown, is_external: false })),
    isFetching: false,
    fetchingError: ''
};
