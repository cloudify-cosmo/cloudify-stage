import React from 'react';
import PropTypes from 'prop-types';

import DataTable from '../dataTable/DataTable';
import IdPopup from '../IdPopup';
import ClusterService from './ClusterService';
import NodeStatus from './NodeStatus';
import { nodeServicesPropType } from './NodeServices';
import { clusterNodeStatuses, clusterServiceEnum, clusterServiceStatuses, clusterServiceStatusEnum } from './consts';

const PublicIP = ({ ip, serviceName }) =>
    serviceName === clusterServiceEnum.manager ? (
        <a href={`http://${ip}`} target="_blank" rel="noopener noreferrer">
            {ip}
        </a>
    ) : (
        ip
    );
PublicIP.propTypes = {
    ip: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired
};

export default function ClusterServicesList({ services, toolbox }) {
    return (
        <DataTable fetchData={toolbox.refresh} selectable>
            <DataTable.Column label="Service Type" width="20%" />
            <DataTable.Column label="Node Name" width="25%" />
            <DataTable.Column label="Status" width="5%" />
            <DataTable.Column label="Private IP" width="15%" />
            <DataTable.Column label="Public IP / LB IP" width="15%" />
            <DataTable.Column label="Version" width="15%" />
            <DataTable.Column label="" width="1%" />

            {_.map(services, (service, serviceName) => {
                const numberOfNodes = _.size(service.nodes);
                const backgroundColor = {
                    [clusterServiceStatusEnum.OK]: '#21ba45',
                    [clusterServiceStatusEnum.DEGRADED]: '#fbbd08',
                    [clusterServiceStatusEnum.FAIL]: '#db2828'
                }[service.status];

                return _(service.nodes)
                    .sortBy('name')
                    .map((node, index) => (
                        <DataTable.Row key={node.id}>
                            {index === 0 && (
                                <DataTable.Data rowsSpan={numberOfNodes} style={{ backgroundColor }}>
                                    <ClusterService isExternal={service.is_external} name={serviceName} />
                                </DataTable.Data>
                            )}
                            <DataTable.Data>{node.name}</DataTable.Data>
                            <DataTable.Data>
                                <NodeStatus
                                    name={node.name}
                                    type={serviceName}
                                    status={node.status}
                                    services={node.services}
                                />
                            </DataTable.Data>
                            <DataTable.Data>{node.private_ip}</DataTable.Data>
                            <DataTable.Data>
                                <PublicIP ip={node.public_ip} serviceName={serviceName} />
                            </DataTable.Data>
                            <DataTable.Data>{node.version}</DataTable.Data>
                            <DataTable.Data>
                                <IdPopup selected id={node.id} buttonPosition="right" />
                            </DataTable.Data>
                        </DataTable.Row>
                    ))
                    .value();
            })}
        </DataTable>
    );
}

const clusterServiceProps = PropTypes.shape({
    status: PropTypes.oneOf(clusterServiceStatuses).isRequired,
    nodes: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.oneOf(clusterNodeStatuses).isRequired,
            public_ip: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            private_ip: PropTypes.string.isRequired,
            services: nodeServicesPropType
        })
    ).isRequired,
    is_external: PropTypes.bool.isRequired
}).isRequired;

ClusterServicesList.propTypes = {
    services: PropTypes.shape(_.mapValues(clusterServiceEnum, () => clusterServiceProps)).isRequired,
    toolbox: PropTypes.shape({ refresh: PropTypes.func.isRequired }).isRequired
};
