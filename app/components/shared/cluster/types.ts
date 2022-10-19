/* eslint-disable camelcase */
import type {
    clusterStatusEnum,
    clusterServiceStatusEnum,
    clusterServiceEnum,
    clusterNodeStatusEnum,
    nodeServiceStatusEnum
} from './consts';

export type ClusterStatus = keyof typeof clusterStatusEnum;

export type ClusterService = keyof typeof clusterServiceEnum;
export type ClusterServiceStatus = keyof typeof clusterServiceStatusEnum;
export interface ClusterServiceData {
    status: ClusterServiceStatus;
    nodes?: Record<string, ClusterNodeData>;
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
