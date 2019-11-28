/**
 * Created by kinneretzin on 26/09/2016.
 */

import React from 'react';
import PropTypes from 'prop-types';

import SystemStatusHeader from '../../containers/status/SystemStatusHeader';
import { ErrorMessage, Link, Table } from '../basic';
import ClusterService from '../basic/cluster/ClusterService';
import {
    clusterServiceBgColor,
    clusterServiceEnum,
    clusterServiceStatusEnum,
    clusterServiceStatuses
} from '../basic/cluster/consts';
import './SystemStatus.css';

export default function SystemServicesStatus({ services, isFetching, fetchingError }) {
    const adminOperationsPageUrl = '/page/admin_operations';

    return (
        <Table celled basic="very" collapsing className="servicesData">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="2">
                        <SystemStatusHeader />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {isFetching ? null : fetchingError ? (
                    <ErrorMessage error={fetchingError} header="Failed to fetch status" />
                ) : (
                    _.map(services, (service, serviceName) => (
                        <Table.Row key={serviceName} style={{ backgroundColor: clusterServiceBgColor[service.status] }}>
                            <Table.Cell>
                                <Link to={adminOperationsPageUrl}>
                                    <ClusterService isExternal={service.is_external} name={serviceName} />
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table>
    );
}

SystemServicesStatus.propTypes = {
    onStatusRefresh: PropTypes.func.isRequired,
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
    services: _.mapValues(clusterServiceEnum, () => ({ status: clusterServiceStatusEnum.FAIL, is_external: false })),
    isFetching: false,
    fetchingError: ''
};
