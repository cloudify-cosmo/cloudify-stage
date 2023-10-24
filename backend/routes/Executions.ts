import express from 'express';
import { isEmpty, pick } from 'lodash';
import type { ElkNode } from 'elkjs';
import ELK from 'elkjs';
import manager from '../handler/services/ManagerService';
import type { GenericErrorResponse, PaginatedResponse } from '../types';
import { getLogger } from '../handler/LoggerHandler';
import type { Operation } from '../handler/ExecutionsHandler';
import {
    adjustingNodeSizes,
    cleanSubgraphsList,
    constructDependencies,
    constructSubgraphs,
    createELKTasksGraphs
} from '../handler/ExecutionsHandler';

const logger = getLogger('Executions');
const router = express.Router();

const elk = new ELK();

const tasksGraphsFetchUrl = '/tasks_graphs';
const operationsFetchUrl = '/operations';

/**
 * This method takes the 'workflow ID' and 'workflow execution name' of a specific execution
 * retrieves the tasks graphs associated with the execution (can be more than one) and retrieves
 * every task graph's operations list
 * In order to visually build the graph without too much headache we use elkjs for the graph
 * visualization calculation, elkjs receives a graph format with requirements and outputs a
 * graph with node and edges (x,y) coordinates to place as we please.
 * E.G:
 *
 * Demo of the object required by ELK to create the graph:
 * const graph = {
 *     id: "root",
 *     layoutOptions: {
 *         'elk.algorithm': 'layered',
 *         'elk.spacing.nodeNode': '20f',
 *         'layered.spacing.nodeNodeBetweenLayers': '20f'
 *     },
 *     children: [
 *         { id: "n1", width: 30, height: 30, labels: [{text: '1'}] },
 *         { id: "n2", width: 30, height: 30, labels: [{text: '2'}] },
 *         { id: "n3", width: 30, height: 30, labels: [{text: '3'}] },
 *         { id: "n4", width: 30, height: 30, labels: [{text: '4'}] },
 *         {
 *             id: "n5",
 *             children: [
 *                 { id: "n6", width: 30, height: 30, labels: [{text: '5'}] },
 *                 { id: "n7", width: 30, height: 30, labels: [{text: '6'}] },
 *                 { id: "n8", width: 30, height: 30, labels: [{text: '7'}] }
 *             ],
 *             edges: [
 *                 { id: "e6", sources: [ "n6" ], targets: [ "n7" ] },
 *                 { id: "e7", sources: [ "n6" ], targets: [ "n8" ] },
 *                 { id: "e7", sources: [ "n7" ], targets: [ "n8" ] }
 *             ],
 *             labels: [{text: '8 - containing graph'}]
 *         }
 *     ],
 *     edges: [
 *         { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
 *         { id: "e2", sources: [ "n1" ], targets: [ "n3" ] },
 *         { id: "e3", sources: [ "n1" ], targets: [ "n4" ] },
 *         { id: "e4", sources: [ "n2" ], targets: [ "n5" ] },
 *         { id: "e5", sources: [ "n2" ], targets: [ "n3" ] }
 *     ]
 * }
 * Once the object is finished creating - ELK will create the graph with the following command:
 * elk.layout(graph)
 *     .then((g) => {
 *         if (this.state.graphResult !== g)
 *         {
 *             this.setState({
 *                 graphResult: g
 *             })
 *         }
 *     })
 *     .catch(console.error)
 *
 *
 * More information can be found here: https://github.com/OpenKieler/elkjs
 */
router.get<never, ElkNode | GenericErrorResponse>('/graph', (req, res, next) => {
    const params = { ...req.query };
    const headers = pick(req.headers, 'cookie', 'tenant') as Record<string, string>;

    manager
        .doGet(tasksGraphsFetchUrl, { params, headers })
        .then(async data => {
            const { items } = data as unknown as PaginatedResponse<{ id: string }>;

            function send404() {
                const message = `No tasks graph for execution id=${params.execution_id}.`;
                logger.info(message);
                res.status(404).send({ message });
            }

            if (isEmpty(items)) {
                send404();
                return;
            }

            const { items: operationsList } = await manager.doGet<PaginatedResponse<Operation>>(operationsFetchUrl, {
                params: { graph_id: items[0].id },
                headers
            });

            // Constructing SubGraphs
            let allSubgraphs = constructSubgraphs(operationsList);

            // Constructing Dependencies
            const edges = constructDependencies(operationsList, allSubgraphs);

            // Increase the Node's rectangle height based on inner texts
            adjustingNodeSizes(allSubgraphs);

            // Remove LocalWorkflow & NOPWorkflowTasks from the graph while keeping it connected
            allSubgraphs = cleanSubgraphsList(allSubgraphs, edges);

            if (isEmpty(allSubgraphs)) {
                send404();
                return;
            }

            // Creating the ELK-formatted graph
            const graphs = createELKTasksGraphs(allSubgraphs, edges);
            const elkGraph = await elk.layout(graphs);

            res.send(elkGraph);
        })
        .catch((error: any) => {
            logger.error(error);
            next(error);
        });
});

export default router;
