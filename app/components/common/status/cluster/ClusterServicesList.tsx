import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import i18n from 'i18next';

import { DataTable } from '../../../basic';
import ClusterService from './ClusterService';
import NodeStatus from './NodeStatus';
import { clusterServiceEnum, clusterServiceBgColor } from './consts';
import type { ReduxState } from '../../../../reducers';
import type { ClusterService as ClusterServiceName } from './types';

interface PublicIPProps {
    ip?: string;
    serviceName: string;
}
const PublicIP: FunctionComponent<PublicIPProps> = ({ ip = '', serviceName }) =>
    ip && serviceName === clusterServiceEnum.manager ? (
        <a href={`http://${ip}`} target="_blank" rel="noopener noreferrer">
            {ip}
        </a>
    ) : (
        <>ip</>
    );

const ClusterServicesList: FunctionComponent = () => {
    const noServicesMessage = i18n.t('cluster.servicesList.noServices');
    const services = useSelector((state: ReduxState) => state.manager.clusterStatus?.services);

    return (
        <DataTable noDataMessage={noServicesMessage} noDataAvailable={_.isEmpty(services)} selectable>
            <DataTable.Column label={i18n.t('cluster.servicesList.serviceType')} width="25%" />
            <DataTable.Column label={i18n.t('cluster.servicesList.nodeName')} width="25%" />
            <DataTable.Column label={i18n.t('cluster.servicesList.status')} width="5%" />
            <DataTable.Column label={i18n.t('cluster.servicesList.privateIp')} width="15%" />
            <DataTable.Column label={i18n.t('cluster.servicesList.publicIp')} width="15%" />
            <DataTable.Column label={i18n.t('cluster.servicesList.version')} width="15%" />

            {_.map(services, (service, serviceName) => {
                const numberOfNodes = _.size(service.nodes);
                const clusterServiceName = serviceName as ClusterServiceName;

                return _(service.nodes)
                    .map((node, nodeName) => ({ name: nodeName, ...node }))
                    .sortBy('name')
                    .map((node, index) => (
                        <DataTable.Row key={`${serviceName}_${node.name}_${node.private_ip}`}>
                            {index === 0 && (
                                <DataTable.Data
                                    rowSpan={numberOfNodes}
                                    style={{ backgroundColor: clusterServiceBgColor(service.status) }}
                                >
                                    <ClusterService isExternal={service.is_external} name={clusterServiceName} />
                                </DataTable.Data>
                            )}
                            <DataTable.Data>{node.name}</DataTable.Data>
                            <DataTable.Data>
                                <NodeStatus
                                    name={node.name}
                                    type={clusterServiceName}
                                    status={node.status}
                                    services={node.services}
                                />
                            </DataTable.Data>
                            <DataTable.Data>{node.private_ip}</DataTable.Data>
                            <DataTable.Data>
                                <PublicIP ip={node.public_ip} serviceName={clusterServiceName} />
                            </DataTable.Data>
                            <DataTable.Data>{node.version}</DataTable.Data>
                        </DataTable.Row>
                    ))
                    .value();
            })}
        </DataTable>
    );
};

export default ClusterServicesList;
