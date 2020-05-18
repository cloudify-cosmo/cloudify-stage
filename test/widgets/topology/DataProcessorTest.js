import { expect } from 'chai';

import nodecellarExampleData from './data/ExampleData.json';
import nodecellarInstancesData from './data/InstancesDataDone.json';
import nodecellarExecutionData from './data/ExecutionsData.json';
import { createBlueprintData, createHierarchy } from '../../../widgets/topology/src/DataProcessor';

describe('(Widget) Topology', () => {
    describe('DataProcessor createBlueprintData', () => {
        it('supports `plan` from manager', () => {
            const data = {
                data: nodecellarExampleData
            };
            expect(data.data).to.exist;

            const blueprintData = createBlueprintData(data);

            expect(_.size(blueprintData)).to.equal(2);
            expect(blueprintData).to.have.property('groups');
            expect(_.size(blueprintData.node_templates)).to.equal(4);
            _.each(data.data.plan.nodes, node => expect(node).to.equal(blueprintData.node_templates[node.name]));
        });

        it('supports deployed instances and executions', () => {
            const data = {
                executions: nodecellarExecutionData,
                instances: nodecellarInstancesData,
                data: nodecellarExampleData
            };

            createBlueprintData(data);

            expect(data.data.plan.nodes[0].deployStatus.label).to.equal('done');
            expect(data.data.plan.nodes[0].deployStatus.completed).to.equal(1);
            expect(data.data.plan.nodes[0].deployStatus.icon).to.exist;
            expect(data.data.plan.nodes[0].deployStatus.color).to.exist;
        });
    });

    it('DataProcessor createHierarchy', () => {
        const hierarchy = createHierarchy(nodecellarExampleData.plan);

        expect(_.size(hierarchy)).to.equal(7);
        expect(hierarchy['cloudify.nodes.Compute']).to.deep.equal(['cloudify.nodes.Compute', 'cloudify.nodes.Root']);
        expect(hierarchy['nodecellar.nodes.NodecellarApplicationModule']).to.deep.equal([
            'nodecellar.nodes.NodecellarApplicationModule',
            'cloudify.nodes.ApplicationModule',
            'cloudify.nodes.Root'
        ]);
        expect(hierarchy['nodecellar.nodes.MongoDatabase']).to.deep.equal([
            'nodecellar.nodes.MongoDatabase',
            'cloudify.nodes.DBMS',
            'cloudify.nodes.SoftwareComponent',
            'cloudify.nodes.Root'
        ]);
        expect(hierarchy['nodecellar.nodes.NodeJSServer']).to.deep.equal([
            'nodecellar.nodes.NodeJSServer',
            'cloudify.nodes.ApplicationServer',
            'cloudify.nodes.SoftwareComponent',
            'cloudify.nodes.Root'
        ]);
        expect(hierarchy.node_connected_to_mongo).to.deep.equal([
            'node_connected_to_mongo',
            'cloudify.relationships.connected_to',
            'cloudify.relationships.depends_on'
        ]);
        expect(hierarchy.node_contained_in_nodejs).to.deep.equal([
            'node_contained_in_nodejs',
            'cloudify.relationships.contained_in',
            'cloudify.relationships.depends_on'
        ]);
        expect(hierarchy['cloudify.relationships.contained_in']).to.deep.equal([
            'cloudify.relationships.contained_in',
            'cloudify.relationships.depends_on'
        ]);
    });
});
