// TODO: RD-6076 - move this typing to cloudify-blueprint-topology
declare module 'cloudify-blueprint-topology' {
    const Consts;
    const DataProcessingService: { encodeTopology: (blueprintData: unknown, hierarchyData: unknown) => TopologyData };
    const NodeDataUtils;

    interface TopologyElement<TemplateData> {
        id?: string;
        name: string;
        templateData: TemplateData;
        connectedTo?: unknown[];
        container?: unknown;
        children?: unknown[];
    }

    interface TopologyData<TemplateData> {
        nodes: TopologyElement<TemplateData>[];
        groups: unknown[];
        connectors: unknown[];
    }

    export class Topology<TemplateData> {
        constructor(
            options: {
                onNodeSelected: (node: TopologyElement<TemplateData>) => void;
                onDataProcessed: (topology: TopologyData<TemplateData>) => void;
                onDeploymentNodeClick: (deploymentId: unknown) => void;
                onTerraformDetailsClick: (terraformNode: TopologyElement<TemplateData>) => void;
                onLayoutSave: (layout: unknown) => void;
            } & Record<string, unknown>
        );

        start();

        setLoading(state: boolean);

        setSelectNode(node: unknown);

        destroy();

        setScale(scale: unknown);

        refreshTopologyDeploymentStatus(topology: unknown);

        clearSelectedNodes();

        setTopology(topology: TopologyData<TemplateData> | null, layout: unknown);
    }
}
