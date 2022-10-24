/* eslint-disable camelcase */
import type { ClusterServiceStatus, clusterServiceEnum, clusterNodeStatusEnum, nodeServiceStatusEnum } from './consts';

export type ClusterStatus = keyof typeof ClusterServiceStatus;

export type ClusterService = keyof typeof clusterServiceEnum;
export interface ClusterServiceData {
    status: ClusterStatus;
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
