import ClusterService from './ClusterService';
import NodeStatus from './NodeStatus';
import { clusterNodeStatuses, clusterService, clusterServiceStatus, clusterServiceStatuses } from './consts';

export default function ClusterServicesList(props) {
    const { services, toolbox } = props;
    const { DataTable } = Stage.Basic;
    const fetchData = fetchParams => toolbox.refresh(fetchParams);

    return (
        <DataTable fetchData={fetchData}>
            <DataTable.Column label="Service Type" width="15%" />
            <DataTable.Column label="Node Name" width="20%" />
            <DataTable.Column label="Status" width="5%" />
            <DataTable.Column label="Private IP" width="15%" />
            <DataTable.Column label="Public IP / LB IP" width="15%" />
            <DataTable.Column label="Version" width="15%" />

            {_.map(services, (service, serviceName) => {
                const numberOfNodes = service.nodes.length;
                const backgroundColor = {
                    [clusterServiceStatus.OK]: '#21ba45',
                    [clusterServiceStatus.DEGRADED]: '#fbbd08',
                    [clusterServiceStatus.FAIL]: '#db2828'
                }[service.status];

                return _(service.nodes)
                    .sortBy(node => node.name)
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
                                {serviceName === clusterService.manager ? (
                                    <a href={`https://${node.public_ip}`} target="_blank" rel="noopener noreferrer">
                                        {node.public_ip}
                                    </a>
                                ) : (
                                    node.public_ip
                                )}
                            </DataTable.Data>
                            <DataTable.Data>{node.version}</DataTable.Data>
                        </DataTable.Row>
                    ))
                    .value();
            })}
        </DataTable>
    );
}

ClusterServicesList.clusterServiceProps = PropTypes.shape({
    status: PropTypes.oneOf(clusterServiceStatuses).isRequired,
    nodes: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.oneOf(clusterNodeStatuses).isRequired,
            public_ip: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            private_ip: PropTypes.string.isRequired
        })
    ).isRequired,
    is_external: PropTypes.bool.isRequired
}).isRequired;

ClusterServicesList.propTypes = {
    services: PropTypes.shape({
        [clusterService.manager]: ClusterServicesList.clusterServiceProps,
        [clusterService.db]: ClusterServicesList.clusterServiceProps,
        [clusterService.broker]: ClusterServicesList.clusterServiceProps
    }).isRequired,
    toolbox: PropTypes.shape({ refresh: PropTypes.func.isRequired }).isRequired
};
