import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { ErrorMessage, Message, Table } from '../../basic';
import ClusterService from './ClusterService';
import { clusterServiceBgColor, clusterServiceEnum, clusterServiceStatusEnum, clusterServiceStatuses } from './consts';
import './ClusterServicesOverview.css';

export default function ClusterServicesOverview({ services, clickable, isFetching, fetchingError, header }) {
    const adminPageId = 'admin_operations';
    const adminPageUrl = `/page/${adminPageId}`;
    const isAdminPagePresent = !!useSelector(state => _.find(state.pages, { id: adminPageId }));

    return (
        <Table celled basic="very" collapsing className="servicesData">
            {!_.isEmpty(header) && <Table.Header>{header}</Table.Header>}
            <Table.Body>
                {isFetching ? null : fetchingError ? (
                    <ErrorMessage error={fetchingError} header="Failed to fetch status" />
                ) : !_.isEmpty(services) ? (
                    _.map(services, (service, serviceName) => (
                        <Table.Row key={serviceName} style={{ backgroundColor: clusterServiceBgColor(service.status) }}>
                            <Table.Cell>
                                {clickable && isAdminPagePresent ? (
                                    <Link to={adminPageUrl}>
                                        <ClusterService isExternal={service.is_external} name={serviceName} />
                                    </Link>
                                ) : (
                                    <ClusterService isExternal={service.is_external} name={serviceName} />
                                )}
                            </Table.Cell>
                        </Table.Row>
                    ))
                ) : (
                    <Message>
                        <Message.Header>No services available</Message.Header>
                    </Message>
                )}
            </Table.Body>
        </Table>
    );
}

ClusterServicesOverview.propTypes = {
    services: PropTypes.shape(
        _.mapValues(clusterServiceEnum, () =>
            PropTypes.shape({
                status: PropTypes.oneOf(clusterServiceStatuses),
                is_external: PropTypes.bool
            })
        )
    ),
    clickable: PropTypes.bool,
    isFetching: PropTypes.bool,
    fetchingError: PropTypes.string,
    header: PropTypes.node
};

ClusterServicesOverview.defaultProps = {
    services: _.mapValues(clusterServiceEnum, () => ({ status: clusterServiceStatusEnum.Unknown, is_external: false })),
    clickable: false,
    isFetching: false,
    fetchingError: '',
    header: null
};
