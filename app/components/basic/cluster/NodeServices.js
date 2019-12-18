import React from 'react';
import PropTypes from 'prop-types';

import { Header, Icon, Table } from 'semantic-ui-react';
import CopyToClipboardButton from '../CopyToClipboardButton';
import Popup from '../Popup';
import JsonUtils from '../../../utils/shared/JsonUtils';

import { clusterServiceEnum, clusterServices, nodeServiceStatusEnum, nodeServiceStatuses } from './consts';

const StatusHeader = ({ nodeName, nodeType }) => {
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

const ServiceHeader = ({ name, description, isRemote }) => {
    return (
        <Header size="tiny">
            <Header.Content>
                {name}&nbsp;
                {isRemote && (
                    <Popup>
                        <Popup.Trigger>
                            <Icon name="external square" />
                        </Popup.Trigger>
                        <Popup.Content>Remote</Popup.Content>
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
    isRemote: PropTypes.bool.isRequired
};
ServiceHeader.defaultProps = {
    description: ''
};

const ServiceStatus = ({ status }) => {
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

export default function NodeServices({ name, type, services }) {
    const numberOfColumns = 2;
    const formattedServices = _(services)
        .keys()
        .sort()
        .map(serviceName => ({
            name: serviceName,
            isRemote: services[serviceName].is_remote,
            status: services[serviceName].status,
            description: _.get(services[serviceName], 'extra_info.systemd.instances[0].Description', ''),
            extraInfo: services[serviceName].extra_info
        }))
        .value();
    const stringifiedServices = JsonUtils.stringify(services, true);

    return (
        <Table celled basic="very" collapsing className="servicesData">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={numberOfColumns}>
                        <StatusHeader nodeName={name} nodeType={type} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {_.map(formattedServices, service => {
                    const { description, isRemote, name: serviceName, status: serviceStatus } = service;
                    return (
                        <Table.Row key={serviceName}>
                            <Table.Cell collapsing>
                                <ServiceHeader name={serviceName} description={description} isRemote={isRemote} />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <ServiceStatus status={serviceStatus} />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={numberOfColumns}>
                        <CopyToClipboardButton
                            className="rightFloated"
                            content="Copy Raw Info"
                            text={stringifiedServices}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
}

export const nodeServicesPropType = PropTypes.objectOf(
    PropTypes.shape({
        is_remote: PropTypes.bool.isRequired,
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
