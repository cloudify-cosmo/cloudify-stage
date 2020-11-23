export const clusterStatusEnum = Object.freeze({
    OK: 'OK',
    Fail: 'Fail',
    Degraded: 'Degraded',
    Unknown: 'Unknown'
});

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
    Fail: 'Fail',
    Degraded: 'Degraded',
    Unknown: 'Unknown'
});
export const clusterServiceStatuses = _.keys(clusterServiceStatusEnum);

export const clusterServiceBgColor = serviceStatus => {
    switch (serviceStatus) {
        case clusterServiceStatusEnum.OK:
            return 'rgba(0,183,164,0.5)';
        case clusterServiceStatusEnum.Degraded:
            return 'rgba(255,209,153,0.5)';
        case clusterServiceStatusEnum.Fail:
            return 'rgba(235,78,91,0.5)';
        default:
            return 'rgb(119,119,119)';
    }
};

export const clusterNodeStatusEnum = Object.freeze({
    OK: 'OK',
    Fail: 'Fail'
});
export const clusterNodeStatuses = _.keys(clusterNodeStatusEnum);

export const nodeServiceStatusEnum = Object.freeze({
    Active: 'Active',
    Inactive: 'Inactive'
});
export const nodeServiceStatuses = _.keys(nodeServiceStatusEnum);
