import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { CopyToClipboardButton, Header, Icon, Table } from '../../basic';
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

const ServiceHeader = ({ name, description }) => {
    return (
        <Header size="tiny">
            <Header.Content>
                {name}
                {description && <Header.Subheader>{description}</Header.Subheader>}
            </Header.Content>
        </Header>
    );
};
ServiceHeader.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string
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
    const formattedServices = _(services)
        .keys()
        .sort()
        .map(serviceName => ({
            name: serviceName,
            status: services[serviceName].status,
            description: _.get(services[serviceName], 'extra_info.systemd.instances[0].Description', ''),
            extraInfo: services[serviceName].extra_info
        }))
        .value();
    const stringifiedServices = JsonUtils.stringify(services, true);

    return (
        <div>
            <StatusHeader nodeName={name} nodeType={type} />
            <Table celled basic="very" collapsing className="servicesData">
                <Table.Body style={{ display: 'block', paddingRight: 10, maxHeight: '60vh', overflowY: 'auto' }}>
                    {_.map(formattedServices, service => {
                        const { description, name: serviceName, status: serviceStatus } = service;
                        return (
                            <Table.Row key={serviceName}>
                                <Table.Cell collapsing>
                                    <ServiceHeader name={serviceName} description={description} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <ServiceStatus status={serviceStatus} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            <CopyToClipboardButton className="rightFloated" content="Copy Raw Info" text={stringifiedServices} />
        </div>
    );
}

export const nodeServicesPropType = PropTypes.objectOf(
    PropTypes.shape({
        status: PropTypes.oneOf(nodeServiceStatuses).isRequired,
        extra_info: PropTypes.shape({
            systemd: PropTypes.shape({
                display_name: PropTypes.string,
                instances: PropTypes.arrayOf(
                    PropTypes.shape({ Description: PropTypes.string, Id: PropTypes.string, State: PropTypes.string })
                ),
                unit_it: PropTypes.string
            })
        })
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
