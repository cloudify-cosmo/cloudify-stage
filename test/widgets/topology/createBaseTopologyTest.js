import { expect } from 'chai';
import createBaseTopology from '../../../widgets/topology/src/createBaseTopology';

import nodecellarExampleData from './data/ExampleData.json';
import nodecellarInstancesData from './data/InstancesDataDone.json';
import nodecellarExecutionData from './data/ExecutionsData.json';

describe('(Widget) Topology', function() {
    it('supports `plan` from manager', function() {
        let data = {
            data: nodecellarExampleData
        };
        expect(data.data).to.exist;
        data = createBaseTopology(data);
        expect(data.nodes.length).to.equal(4);
        expect(data.connectors.length).to.equal(1);
        expect(data.data).not.to.exist;
        expect(data.nodes[0].hierarchy[1]).to.equal('cloudify.nodes.Root'); // test root being the last item in the hierarchy list
        expect(data.nodes[0].templateData.actual_planned_number_of_instances).to.exist; // test support for instances
    });

    it('supports deployed instances and executions', function() {
        let data = {
            executions: nodecellarExecutionData,
            instances: nodecellarInstancesData,
            data: nodecellarExampleData
        };

        data = createBaseTopology(data);
        expect(data.nodes[0].templateData.deployStatus.label).to.equal('done');
        expect(data.nodes[0].templateData.deployStatus.completed).to.equal(1);
        expect(data.nodes[0].templateData.deployStatus.icon).to.exist;
        expect(data.nodes[0].templateData.deployStatus.color).to.exist;
    });
});
