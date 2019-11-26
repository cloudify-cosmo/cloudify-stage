export const clusterServiceName = Object.freeze({
    manager: 'Manager',
    db: 'Database',
    broker: 'Message Broker'
});

export const clusterServiceEnum = Object.freeze({
    manager: 'manager',
    db: 'db',
    broker: 'broker'
});
export const clusterServices = _.keys(clusterServiceEnum);

export const clusterServiceStatusEnum = Object.freeze({
    OK: 'OK',
    FAIL: 'Fail',
    DEGRADED: 'Degraded'
});
export const clusterServiceStatuses = _.keys(clusterServiceStatusEnum);

export const clusterNodeStatusEnum = Object.freeze({
    OK: 'OK',
    FAIL: 'Fail'
});
export const clusterNodeStatuses = _.keys(clusterNodeStatusEnum);

export const nodeServiceStatusEnum = Object.freeze({
    Active: 'Active',
    Inactive: 'Inactive'
});
export const nodeServiceStatuses = _.keys(nodeServiceStatusEnum);
