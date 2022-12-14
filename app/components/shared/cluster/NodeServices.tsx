import _ from 'lodash';
import React from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';

import { CopyToClipboardButton, Header, Icon, Table } from '../../basic';
import JsonUtils from '../../../utils/shared/JsonUtils';

import { clusterServiceIcon, nodeServiceStatusEnum } from './consts';
import type { ClusterService, NodeServiceStatus, NodeServices as Services } from './types';

interface StatusHeaderProps {
    nodeName: string;
    nodeType: ClusterService;
}
const StatusHeader: FunctionComponent<StatusHeaderProps> = ({ nodeName, nodeType }) => {
    const nodeIcon = clusterServiceIcon(nodeType);

    return (
        <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
            <Icon name={nodeIcon} />
            {nodeName} {i18n.t('cluster.servicesStatus')}
        </Header>
    );
};

interface ServiceHeaderProps {
    name: string;
    description: string;
}
const ServiceHeader: FunctionComponent<ServiceHeaderProps> = ({ name, description = '' }) => {
    return (
        <Header size="tiny">
            <Header.Content>
                {name}
                {description && <Header.Subheader>{description}</Header.Subheader>}
            </Header.Content>
        </Header>
    );
};

interface ServiceStatusProps {
    status: NodeServiceStatus;
}
const ServiceStatus: FunctionComponent<ServiceStatusProps> = ({ status }) => {
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

export interface NodeServicesProps {
    name: string;
    type: ClusterService;
    services: Services;
}
const NodeServices: FunctionComponent<NodeServicesProps> = ({ name, type, services = {} }) => {
    const formattedServices = _(services)
        .keys()
        .sort()
        .map(serviceName => ({
            name: serviceName,
            status: services[serviceName].status,
            description: services[serviceName].extra_info?.supervisord?.instances?.[0]?.Description || '',
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
            <CopyToClipboardButton
                className="rightFloated"
                content={i18n.t('cluster.copyInfo')}
                text={stringifiedServices}
            />
        </div>
    );
};
export default NodeServices;
