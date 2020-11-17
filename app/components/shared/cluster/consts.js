import _ from 'lodash';

export const clusterStatusEnum = Object.freeze({
    OK: 'OK',
    Fail: 'Fail',
    Degraded: 'Degraded',
    Unknown: 'Unknown'
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
            return '#21ba45';
        case clusterServiceStatusEnum.Degraded:
            return '#fbbd08';
        case clusterServiceStatusEnum.Fail:
            return '#db2828';
        default:
            return '#aaaaaa';
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
