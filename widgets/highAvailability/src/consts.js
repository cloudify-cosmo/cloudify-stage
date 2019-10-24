import _ from 'lodash';

export const clusterService = {
    manager: 'manager',
    db: 'db',
    broker: 'broker'
};
export const clusterServices = _.keys(clusterService);

export const clusterServiceName = {
    manager: 'Manager',
    db: 'Database',
    broker: 'Broker'
};

export const clusterServiceStatus = {
    OK: 'OK',
    FAIL: 'FAIL',
    DEGRADED: 'DEGRADED'
};
export const clusterServiceStatuses = _.keys(clusterServiceStatus);

export const clusterNodeStatus = {
    OK: 'OK',
    FAIL: 'FAIL'
};
export const clusterNodeStatuses = _.keys(clusterNodeStatus);

export const nodeServiceStatus = {
    Active: 'Active',
    Inactive: 'Inactive'
};
export const nodeServiceStatuses = _.keys(nodeServiceStatus);
