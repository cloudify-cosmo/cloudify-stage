import { createBlueprintData, createHierarchy } from 'topology/src/DataProcessor';
import nodecellarExampleData from './data/ExampleData.json';
import nodecellarInstancesData from './data/InstancesDataDone.json';
import nodecellarExecutionData from './data/ExecutionsData.json';

describe('(Widget) Topology', () => {
    describe('DataProcessor createBlueprintData', () => {
        it('supports `plan` from manager', () => {
            const data = {
                data: nodecellarExampleData
            };
            expect(data.data).not.toBeUndefined();
            expect(data.data).not.toBeNull();

            const blueprintData = createBlueprintData(data);

            expect(_.size(blueprintData)).toBe(2);
            expect(blueprintData).toHaveProperty('groups');
            expect(_.size(blueprintData.node_templates)).toBe(4);
            _.each(data.data.plan.nodes, node => expect(node).toBe(blueprintData.node_templates[node.name]));
        });

        it('supports deployed instances and executions', () => {
            const data = {
                executions: nodecellarExecutionData,
                instances: nodecellarInstancesData,
                data: nodecellarExampleData
            };

            createBlueprintData(data);

            expect(data.data.plan.nodes[0].deployStatus.label).toBe('done');
            expect(data.data.plan.nodes[0].deployStatus.completed).toBe(1);
            expect(data.data.plan.nodes[0].deployStatus.icon).not.toBeUndefined();
            expect(data.data.plan.nodes[0].deployStatus.icon).not.toBeNull();
            expect(data.data.plan.nodes[0].deployStatus.color).not.toBeUndefined();
            expect(data.data.plan.nodes[0].deployStatus.color).not.toBeNull();
        });
    });

    it('DataProcessor createHierarchy', () => {
        const hierarchy = createHierarchy(nodecellarExampleData.plan);

        expect(_.size(hierarchy)).toBe(7);
        expect(hierarchy['cloudify.nodes.Compute']).toEqual(['cloudify.nodes.Compute', 'cloudify.nodes.Root']);
        expect(hierarchy['nodecellar.nodes.NodecellarApplicationModule']).toEqual([
            'nodecellar.nodes.NodecellarApplicationModule',
            'cloudify.nodes.ApplicationModule',
            'cloudify.nodes.Root'
        ]);
        expect(hierarchy['nodecellar.nodes.MongoDatabase']).toEqual([
            'nodecellar.nodes.MongoDatabase',
            'cloudify.nodes.DBMS',
            'cloudify.nodes.SoftwareComponent',
            'cloudify.nodes.Root'
        ]);
        expect(hierarchy['nodecellar.nodes.NodeJSServer']).toEqual([
            'nodecellar.nodes.NodeJSServer',
            'cloudify.nodes.ApplicationServer',
            'cloudify.nodes.SoftwareComponent',
            'cloudify.nodes.Root'
        ]);
        expect(hierarchy.node_connected_to_mongo).toEqual([
            'node_connected_to_mongo',
            'cloudify.relationships.connected_to',
            'cloudify.relationships.depends_on'
        ]);
        expect(hierarchy.node_contained_in_nodejs).toEqual([
            'node_contained_in_nodejs',
            'cloudify.relationships.contained_in',
            'cloudify.relationships.depends_on'
        ]);
        expect(hierarchy['cloudify.relationships.contained_in']).toEqual([
            'cloudify.relationships.contained_in',
            'cloudify.relationships.depends_on'
        ]);
    });
});
