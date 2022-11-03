/* eslint-disable camelcase */
import type { clusterServiceEnum, clusterNodeStatusEnum, nodeServiceStatusEnum } from './consts';

export enum ClusterServiceStatus {
    OK,
    Fail,
    Degraded,
    Unknown
}
export type ServiceStatus = keyof typeof ClusterServiceStatus;

export type ClusterService = keyof typeof clusterServiceEnum;
export interface ClusterServiceData {
    status: keyof typeof ClusterServiceStatus;
    nodes: Record<string, ClusterNodeData>;
    is_external: boolean;
}
export type ClusterServices = Record<ClusterService, ClusterServiceData>;

export type ClusterNodeStatus = keyof typeof clusterNodeStatusEnum;
export interface ClusterNodeData {
    status: ClusterNodeStatus;
    public_ip?: string;
    version: string;
    private_ip: string;
    services: NodeServices;
}

export type NodeServiceStatus = keyof typeof nodeServiceStatusEnum;
export interface NodeService {
    status: NodeServiceStatus;
    extra_info: {
        supervisord: {
            display_name: string;
            instances: {
                Description: string;
                Id: string;
                State: string;
            }[];
            unit_id: string;
        };
    };
}
export type NodeServices = Record<string, NodeService>;
