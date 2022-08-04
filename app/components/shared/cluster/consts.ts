import _ from 'lodash';
import type { SemanticICONS } from 'semantic-ui-react';
import type { ClusterService, ClusterServiceStatus } from './types';

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

export const clusterServiceBgColor = (serviceStatus: ClusterServiceStatus) => {
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

export const clusterServiceIcon: (clusterService: ClusterService) => SemanticICONS = clusterService => {
    switch (clusterService) {
        case clusterServiceEnum.manager:
            return 'settings' as SemanticICONS;
        case clusterServiceEnum.db:
            return 'database' as SemanticICONS;
        case clusterServiceEnum.broker:
            return 'comments' as SemanticICONS;
        default:
            return 'question';
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
