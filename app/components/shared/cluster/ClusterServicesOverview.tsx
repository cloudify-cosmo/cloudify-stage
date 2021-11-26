// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import i18n from 'i18next';
import { Link } from 'react-router-dom';
import { ErrorMessage, LoadingOverlay, Message, Table } from '../../basic';
import ClusterService from './ClusterService';
import { clusterServiceBgColor, clusterServiceEnum, clusterServiceStatusEnum, clusterServiceStatuses } from './consts';
import './ClusterServicesOverview.css';
import { createPagesMap } from '../../../actions/pageMenu';

export default function ClusterServicesOverview({ services, clickable, isFetching, fetchingError, header }) {
    const systemHealthPageId = 'system_health';
    const systemHealthPageUrl = `/page/${systemHealthPageId}`;
    const isSystemHealthPagePresent = !!useSelector(state => createPagesMap(state.pages)[systemHealthPageId]);

    return (
        <>
            {!_.isEmpty(header) && header}
            <Table celled basic="very" collapsing className="servicesData" style={{ position: 'relative' }}>
                <Table.Body>
                    {isFetching && <LoadingOverlay />}
                    {fetchingError && (
                        <ErrorMessage
                            error={fetchingError}
                            header={i18n.t('cluster.overview.errorHeader', 'Failed to fetch status')}
                        />
                    )}
                    {!fetchingError &&
                        (!_.isEmpty(services) ? (
                            _.map(services, (service, serviceName) => (
                                <Table.Row
                                    key={serviceName}
                                    style={{ backgroundColor: clusterServiceBgColor(service.status) }}
                                >
                                    <Table.Cell>
                                        {clickable && isSystemHealthPagePresent ? (
                                            <Link to={systemHealthPageUrl}>
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
                                <Message.Header>
                                    {i18n.t('cluster.overview.noServices', 'No services available')}
                                </Message.Header>
                            </Message>
                        ))}
                </Table.Body>
            </Table>
        </>
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
