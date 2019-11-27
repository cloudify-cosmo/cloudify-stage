/**
 * Created by kinneretzin on 26/09/2016.
 */

import React from 'react';
import PropTypes from 'prop-types';

import SystemStatusIcon from '../containers/SystemStatusIcon';
import { Button, ErrorMessage, Header, Link, Table } from './basic/index';
import ClusterService from './basic/cluster/ClusterService';
import {
    clusterServiceBgColor,
    clusterServiceEnum,
    clusterServiceStatusEnum,
    clusterServiceStatuses
} from './basic/cluster/consts';

export default function SystemServicesStatus({ services, isFetching, fetchingError, onStatusRefresh }) {
    const adminOperationsPageUrl = '/page/admin_operations';

    return (
        <Table celled basic="very" collapsing className="servicesData">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="2">
                        <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
                            <SystemStatusIcon />
                            System Status
                        </Header>
                        <Button
                            floated="right"
                            className="refreshButton"
                            onClick={onStatusRefresh}
                            loading={isFetching}
                            disabled={isFetching}
                            circular
                            icon="refresh"
                        />
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
