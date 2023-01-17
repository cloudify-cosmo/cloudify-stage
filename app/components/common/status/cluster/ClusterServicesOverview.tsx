import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import i18n from 'i18next';
import { Link } from 'react-router-dom';
import type { FunctionComponent, ReactNode } from 'react';

import { ErrorMessage, LoadingOverlay, Message, Table } from '../../../basic';
import ClusterService from './ClusterService';
import { clusterServiceBgColor, clusterServiceEnum } from './consts';
import { ClusterServiceStatus } from './types';
import './ClusterServicesOverview.css';
import { createPagesMap } from '../../../../actions/pageMenu';
import type { ClusterService as ClusterServiceName, ClusterServices } from './types';
import type { ReduxState } from '../../../../reducers';

interface ClusterServicesOverviewProps {
    services: ClusterServices;
    clickable?: boolean;
    isFetching?: boolean;
    fetchingError?: string;
    header?: ReactNode;
}
const ClusterServicesOverview: FunctionComponent<ClusterServicesOverviewProps> = ({
    services = _.mapValues(clusterServiceEnum, () => ({
        status: ClusterServiceStatus.Unknown,
        is_external: false
    })),
    clickable = false,
    isFetching = false,
    fetchingError = '',
    header = null
}) => {
    const systemHealthPageId = 'system_health';
    const systemHealthPageUrl = `/page/${systemHealthPageId}`;
    const isSystemHealthPagePresent = !!useSelector(
        (state: ReduxState) => createPagesMap(state.pages)[systemHealthPageId]
    );

    return (
        <>
            {!_.isEmpty(header) && header}
            <Table
                celled
                basic="very"
                collapsing
                className="servicesData"
                style={{ position: 'relative', width: '100%' }}
            >
                <Table.Body>
                    {isFetching && <LoadingOverlay />}
                    {fetchingError && (
                        <ErrorMessage error={fetchingError} header={i18n.t('cluster.overview.errorHeader')} />
                    )}
                    {!fetchingError &&
                        (!_.isEmpty(services) ? (
                            _.map(services, (service, serviceName) => {
                                const clusterServiceName = serviceName as ClusterServiceName;
                                return (
                                    <Table.Row
                                        key={serviceName}
                                        style={{ backgroundColor: clusterServiceBgColor(service.status) }}
                                    >
                                        <Table.Cell>
                                            {clickable && isSystemHealthPagePresent ? (
                                                <Link to={systemHealthPageUrl}>
                                                    <ClusterService
                                                        isExternal={service.is_external}
                                                        name={clusterServiceName}
                                                    />
                                                </Link>
                                            ) : (
                                                <ClusterService
                                                    isExternal={service.is_external}
                                                    name={clusterServiceName}
                                                />
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        ) : (
                            <Message>
                                <Message.Header>{i18n.t('cluster.overview.noServices')}</Message.Header>
                            </Message>
                        ))}
                </Table.Body>
            </Table>
        </>
    );
};
export default ClusterServicesOverview;
