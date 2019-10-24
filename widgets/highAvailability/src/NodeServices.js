import _ from 'lodash';
import { clusterService, clusterServices, nodeServiceStatus, nodeServiceStatuses } from './consts';

const StatusHeader = ({ nodeName, nodeType }) => {
    const { Header, Icon } = Stage.Basic;
    const nodeIcon = {
        [clusterService.manager]: 'settings',
        [clusterService.db]: 'database',
        [clusterService.broker]: 'comments'
    }[nodeType];

    return (
        <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
            <Icon name={nodeIcon} />
            {nodeName} Services Status
        </Header>
    );
};
StatusHeader.propTypes = {
    nodeName: PropTypes.string.isRequired,
    nodeType: PropTypes.oneOf(clusterServices).isRequired
};

const ServiceHeader = ({ name, description, isExternal }) => {
    const { Header, Icon, Popup } = Stage.Basic;

    return (
        <Header size="tiny">
            <Header.Content>
                {name}&nbsp;
                {isExternal && (
                    <Popup>
                        <Popup.Trigger>
                            <Icon name="external square" />
                        </Popup.Trigger>
                        <Popup.Content>External</Popup.Content>
                    </Popup>
                )}
                {description && <Header.Subheader>{description}</Header.Subheader>}
            </Header.Content>
        </Header>
    );
};
ServiceHeader.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    isExternal: PropTypes.bool.isRequired
};
ServiceHeader.defaultProps = {
    description: ''
};

const ServiceStatus = ({ status }) => {
    const { Icon } = Stage.Basic;

    const StatusIcon = () => {
        switch (status) {
            case nodeServiceStatus.Active:
                return <Icon name="checkmark" color="green" />;
            case nodeServiceStatus.Inactive:
                return <Icon name="remove" color="red" />;
            default:
                return <Icon name="question" color="grey" />;
        }
    };
    return (
        <>
            <StatusIcon />
            {status}
        </>
    );
};
ServiceStatus.propTypes = {
    status: PropTypes.oneOf(nodeServiceStatuses).isRequired
};

export default function NodeServices({ name, type, services }) {
    const { Table } = Stage.Basic;

    const formattedServices = _(services)
        .keys()
        .sort()
        .map(serviceName => ({
            name: serviceName,
            isExternal: services[serviceName].is_external,
            status: services[serviceName].status,
            description: _.get(services[serviceName], 'extra_info.systemd.instances[0].Description', '')
        }))
        .value();

    return (
        <Table celled basic="very" collapsing className="servicesData">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="2">
                        <StatusHeader nodeName={name} nodeType={type} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {_.map(formattedServices, service => {
                    const { description, isExternal, name: serviceName, status: serviceStatus } = service;
                    return (
                        <Table.Row key={serviceName}>
                            <Table.Cell collapsing>
                                <ServiceHeader name={serviceName} description={description} isExternal={isExternal} />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <ServiceStatus status={serviceStatus} />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}

NodeServices.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(clusterServices).isRequired,
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
NodeServices.defaultProps = {
    services: {}
};
