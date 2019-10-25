import { clusterServiceEnum, clusterServices, nodeServiceStatusEnum, nodeServiceStatuses } from './consts';

const StatusHeader = ({ nodeName, nodeType }) => {
    const { Header, Icon } = Stage.Basic;
    const nodeIcon = {
        [clusterServiceEnum.manager]: 'settings',
        [clusterServiceEnum.db]: 'database',
        [clusterServiceEnum.broker]: 'comments'
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

    let icon = <Icon name="question" color="grey" />;
    if (status === nodeServiceStatusEnum.Active) {
        icon = <Icon name="checkmark" color="green" />;
    } else if (status === nodeServiceStatusEnum.Inactive) {
        icon = <Icon name="remove" color="red" />;
    }

    return (
        <>
            {icon} {status}
        </>
    );
};
ServiceStatus.propTypes = {
    status: PropTypes.oneOf(nodeServiceStatuses).isRequired
};

const ServiceExtraInfo = ({ extraInfo }) => {
    const { HighlightText, Icon, Popup } = Stage.Basic;
    const { stringify } = Stage.Utils.Json;

    return (
        <Popup wide="very">
            <Popup.Trigger>
                <Icon name="info" />
            </Popup.Trigger>
            <Popup.Content>
                <HighlightText className="json">{stringify(extraInfo, true)}</HighlightText>
            </Popup.Content>
        </Popup>
    );
};
ServiceStatus.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    extraInfo: PropTypes.object.isRequired
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
            description: _.get(services[serviceName], 'extra_info.systemd.instances[0].Description', ''),
            extraInfo: services[serviceName].extra_info
        }))
        .value();

    return (
        <Table celled basic="very" collapsing className="servicesData">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="3">
                        <StatusHeader nodeName={name} nodeType={type} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {_.map(formattedServices, service => {
                    const { description, isExternal, name: serviceName, status: serviceStatus, extraInfo } = service;
                    return (
                        <Table.Row key={serviceName}>
                            <Table.Cell collapsing>
                                <ServiceHeader name={serviceName} description={description} isExternal={isExternal} />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <ServiceStatus status={serviceStatus} />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <ServiceExtraInfo extraInfo={extraInfo} />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}

export const nodeServicesPropType = PropTypes.objectOf(
    PropTypes.shape({
        is_external: PropTypes.bool.isRequired,
        status: PropTypes.oneOf(nodeServiceStatuses).isRequired,
        extra_info: PropTypes.object
    })
);

NodeServices.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(clusterServices).isRequired,
    services: nodeServicesPropType
};
NodeServices.defaultProps = {
    services: {}
};
