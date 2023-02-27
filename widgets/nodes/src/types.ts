/* eslint-disable camelcase */

import type { DataTableConfiguration, PollingTimeConfiguration } from 'app/utils/GenericConfig';

export interface NodesConfiguration extends PollingTimeConfiguration, DataTableConfiguration {
    fieldsToShow: string;
}

export type TypeHierarchy = string[];

interface NodeRelationship {
    target_id: string;
    type: string;
}

export interface Node {
    actual_number_of_instances: number;
    blueprint_id: string;
    created_by: string;
    deployment_display_name: string;
    deployment_id: string;
    host_id: string;
    id: string;
    relationships: NodeRelationship[];
    type: string;
    type_hierarchy: TypeHierarchy;
}

export interface ExtendedNode extends Node {
    connectedTo: string;
    containedIn: string;
    groups: string;
    instances: ExtendedNodeInstance[];
    isSelected: boolean;
    numberOfInstances: number;
}

interface NodeInstanceRelationship extends NodeRelationship {
    target_name: string;
}

export interface NodeInstance {
    deployment_id: string;
    id: string;
    node_id: string;
    relationships: NodeInstanceRelationship[];
    runtime_properties: Record<string, any>;
    state: string;
}

export interface ExtendedNodeInstance extends NodeInstance {
    isSelected: boolean;
}
