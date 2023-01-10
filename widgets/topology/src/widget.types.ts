import type { TopologyData, TopologyElement } from 'cloudify-blueprint-topology';
import type { FullBlueprintData, Node, Relationship } from 'app/widgets/common/blueprints/BlueprintActions';
import type { BlueprintLayout } from 'backend/routes/BlueprintUserData.types';

export type StageTopologyData = TopologyData<NodeTemplateData>;
export type StageTopologyElement = TopologyElement<NodeTemplateData>;

export type NodeTemplateData = Pick<
    Node,
    'actual_number_of_instances' | 'actual_planned_number_of_instances' | 'type' | 'plugins' | 'capabilities'
> & {
    deployStatus?: {
        label: string;
        completed: number;
        icon: string;
        color: string;
        states: Record<string, number>;
    };
    deploymentId?: string;
    terraformResources?: TerraformResources;
    relationships?: (Relationship & {
        target: Relationship['target_id'];
    })[];
};

export type TerraformResources = Record<
    string,
    {
        name: string;
        type?: string;
        provider?: string;
        instances?: unknown[];
    }
>;

export interface NodeInstance {
    // eslint-disable-next-line camelcase
    runtime_properties: Record<string, any>;
    state?: string;
}

export interface ManagerData {
    data?: FullBlueprintData;
    layout?: BlueprintLayout;
    instances?: NodeInstance[];
    inProgress?: boolean;
}

export declare namespace TopologyWidget {
    interface Params {
        blueprintId?: string;
        deploymentId?: string;
    }

    interface Data {
        processedBlueprintData?: StageTopologyData;
        componentDeploymentsData: Record<string, StageTopologyData>;
        rawBlueprintData?: ManagerData;
        icons: Record<string, string>;
    }

    interface Configuration {
        enableNodeClick: boolean;
        enableGroupClick: boolean;
        enableZoom: boolean;
        enableDrag: boolean;
        showToolbar: boolean;
    }
}
