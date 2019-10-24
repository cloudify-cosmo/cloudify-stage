import NodeServices from './NodeServices';
import { clusterNodeStatus, clusterNodeStatuses, clusterServices, nodeServiceStatuses } from './consts';

export default function NodeStatus({ name, type, status, services }) {
    const { Icon, Popup } = Stage.Basic;

    const StatusIcon = () =>
        ({
            [clusterNodeStatus.OK]: <Icon name="checkmark" color="green" link />,
            [clusterNodeStatus.FAIL]: <Icon name="remove" color="red" link />
        }[status]);

    return (
        <Popup hoverable>
            <Popup.Trigger>
                <span>
                    <StatusIcon />
                </span>
            </Popup.Trigger>
            <Popup.Content>
                <NodeServices name={name} type={type} services={services} />
            </Popup.Content>
        </Popup>
    );
}

NodeStatus.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(clusterServices).isRequired,
    status: PropTypes.oneOf(clusterNodeStatuses).isRequired,
    services: PropTypes.objectOf(
        PropTypes.shape({
            is_external: PropTypes.bool,
            status: PropTypes.oneOf(nodeServiceStatuses),
            extra_info: PropTypes.shape({
                systemd: PropTypes.shape({
                    instances: PropTypes.arrayOf(
                        PropTypes.shape({
                            Description: PropTypes.string
                        })
                    )
                })
            })
        })
    )
};
NodeStatus.defaultProps = {
    services: {}
};
