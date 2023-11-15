import { capitalize, compact, floor, get, includes, isEmpty, lowerCase, split, upperFirst } from 'lodash';
import type { ElkNode } from 'elkjs';
import type { ExecutionGraphNode, Operation } from './ExecutionsHandler.types';

const subgraphTask = 'SubgraphTask';

const paddingLeftRight = 24;
const paddingTop = 46;
const paddingBottom = 28;
const subGraphLayoutOptions = {
    'elk.padding': `[top=${paddingTop},left=${paddingLeftRight},bottom=${paddingBottom},right=${paddingLeftRight}]`
};

// This is a rough estimate of how much space each character in a string takes.
// This will be used when a text needs to be displayed inside a node (rectangle)
// and exceeds its width, resulting in increasing the rectangle's height and
// breaking the string into 2 (and so forth...)
const textSizingFactor = 5.8;
const textHeight = 18;

function isRetried(node: ExecutionGraphNode) {
    const { retry } = node.labels[0];
    return retry && retry > 0;
}

const isLeafNode = (subGraph: ExecutionGraphNode) => isEmpty(subGraph.children);

function parseOperationName(operation: Operation) {
    const name = split(operation.name, 'cloudify.interfaces.');
    return name.length > 1 ? name[1] : upperFirst(name[0]);
}

export const constructSubgraphs = (operationsList: Operation[]) => {
    // All the subgraphs and leaves are in the same list for better time-complexity performance, meaning -
    // For every subgraph - instead of traversing its children until we find the desired subgraph/leaf, we simply
    // keep the child (or grand child) subgraph/leaf in the first-tier list as a pointer to the real child.
    // When we're done creating the skeleton for ELK, we remove all the pointers and only keep the root subgraphs.
    const allSubgraphs: Record<string, ExecutionGraphNode> = {};
    operationsList.forEach(operation => {
        const taskName = parseOperationName(operation);

        let taskOperation = '';
        const taskArgs = operation.parameters.task_kwargs;
        if (taskArgs.cloudify_context && taskArgs.cloudify_context.operation) {
            taskOperation = parseOperationName(taskArgs.cloudify_context.operation);
            taskOperation = capitalize(lowerCase(taskOperation));
        }

        const cloudifyContext = get(taskArgs.kwargs, '__cloudify_context', {});
        let subGraph: ExecutionGraphNode = {
            // subGraph can be a subGraph or a 'leaf'
            id: operation.id,
            labels: [
                {
                    text: taskName,
                    retry: 0,
                    type: operation.type,
                    state: upperFirst(operation.state),
                    operation: taskOperation,
                    displayText: []
                }
            ],
            nodeInstanceId: cloudifyContext.node_id,
            operation: get(cloudifyContext.operation, 'name'),
            children: [],
            edges: []
        };
        if (!Object.prototype.hasOwnProperty.call(allSubgraphs, operation.id)) {
            allSubgraphs[operation.id] = subGraph;
        } else {
            allSubgraphs[operation.id].labels[0].text = taskName;
            allSubgraphs[operation.id].labels[0].type = operation.type;
            allSubgraphs[operation.id].labels[0].operation = taskOperation;
            subGraph = allSubgraphs[operation.id];
        }
        if (operation.parameters.containing_subgraph) {
            // Task is inside a Subgraph (could be subgraph in subgraph)
            // Need to create its parent and update self as its child
            const { containing_subgraph: containingSubgraph } = operation.parameters;
            subGraph.containingSubgraph = containingSubgraph;
            if (!Object.prototype.hasOwnProperty.call(allSubgraphs, containingSubgraph)) {
                // Parent does not exist - creating parent skeleton to be filled later
                const parentGraph = {
                    id: containingSubgraph,
                    labels: [{}],
                    children: [subGraph],
                    edges: []
                };
                allSubgraphs[containingSubgraph] = parentGraph;
            } else {
                // parentGraph already exists - only update its children and its child that its contained in it
                allSubgraphs[containingSubgraph].children.push(subGraph);
                allSubgraphs[containingSubgraph].labels[0].state = undefined;
                allSubgraphs[operation.id].containingSubgraph = containingSubgraph;
            }

            if (operation.dependencies) {
                // Updating task dependencies not to include containing_subgraph
                operation.dependencies = operation.dependencies.filter(
                    taskId => taskId !== operation.parameters.containing_subgraph
                );
            }
        }
    });
    return allSubgraphs;
};

export const constructDependencies = (
    operationsList: Operation[],
    allSubgraphs: Record<string, ExecutionGraphNode>
) => {
    // Connecting all the operations into a graph
    // *IMPORTANT NOTE* - Retrying tasks depend on their previous failed task
    const edges: any[] = [];
    operationsList.forEach(operation => {
        if (operation.parameters.current_retries > 0) {
            allSubgraphs[operation.id].labels[0].retry = operation.parameters.current_retries;
        }
        if (isLeafNode(allSubgraphs[operation.id])) {
            allSubgraphs[operation.id].width = 270;
            allSubgraphs[operation.id].height = 40;
        }
        operationsList.forEach(anotherOperation => {
            if (
                anotherOperation.dependencies.indexOf(operation.id) > -1 ||
                anotherOperation.parameters.retried_task === operation.id
            ) {
                const edge = {
                    id: `${operation.id}_${anotherOperation.id}`,
                    sources: [operation.id],
                    targets: [anotherOperation.id]
                };
                const { containingSubgraph } = allSubgraphs[operation.id];
                if (containingSubgraph === undefined) {
                    edges.push(edge);
                } else {
                    allSubgraphs[containingSubgraph].edges?.push(edge);
                }
            }
        });
    });
    return edges;
};
const shouldHideTask = (workflowTask: ExecutionGraphNode) => {
    const typesToHide = [
        'SendNodeEventTask',
        'SetNodeInstanceStateTask',
        'GetNodeInstanceStateTask',
        'SendNodeEventTask',
        'SendWorkflowEventTask',
        'UpdateExecutionStatusTask',
        // keep those two for compat with pre-6.2 executions
        'LocalWorkflowTask',
        'NOPLocalWorkflowTask'
    ];
    return isRetried(workflowTask) || includes(typesToHide, workflowTask.labels[0].type);
};
const safeDeleteIrrelevantGraphVertices = (allSubgraphs: Record<string, ExecutionGraphNode>) => {
    // Remove send-event, set-state, and retrying-tasks from the graph
    // while keeping it connected
    const existingEdges = new Set(); // Used to remove duplicate edges
    Object.values(allSubgraphs).forEach(subGraph => {
        if (subGraph.children.length > 0) {
            // Go through all the subgraphs
            subGraph.children = compact(
                subGraph.children.map(workflowTask => {
                    // For each subgraph, go through all the tasks
                    if (shouldHideTask(workflowTask)) {
                        // For each hidden task, connect the 'target'
                        // edges to it's parents' 'target' edges
                        // Remove the node when done
                        const sourceNodes: string[] = [];
                        const targetNodes: string[] = [];
                        // Need to go through the array twice because the
                        // update of the rest of the edges must be after all the
                        // "Node to remove"'s edges have been scanned
                        subGraph.edges = compact(
                            subGraph.edges?.map(edge => {
                                const sourceNode = edge.sources[0];
                                const targetNode = edge.targets[0];
                                if (sourceNode === workflowTask.id) {
                                    targetNodes.push(targetNode);
                                    return undefined;
                                }
                                if (targetNode === workflowTask.id) {
                                    sourceNodes.push(sourceNode);
                                    if (isRetried(workflowTask)) {
                                        // If a task is retrying - delete it and combine it with its father
                                        allSubgraphs[sourceNode].labels[0].retry = workflowTask.labels[0].retry;
                                        allSubgraphs[sourceNode].labels[0].state = workflowTask.labels[0].state;
                                        allSubgraphs[sourceNode].labels[0].displayText =
                                            workflowTask.labels[0].displayText;
                                    }
                                    return undefined;
                                }
                                return edge;
                            })
                        );
                        sourceNodes.forEach(sourceNodeId => {
                            targetNodes.forEach(targetNodeId => {
                                const newEdge = {
                                    id: `${sourceNodeId}_${targetNodeId}`,
                                    sources: [`${sourceNodeId}`],
                                    targets: [`${targetNodeId}`]
                                };
                                if (!existingEdges.has(newEdge.id)) {
                                    subGraph.edges?.push(newEdge);
                                    existingEdges.add(newEdge.id);
                                }
                            });
                        });
                        return undefined;
                    }
                    return workflowTask;
                })
            );
        }
    });
    return allSubgraphs;
};

export const adjustingNodeSizes = (allSubgraphs: Record<string, ExecutionGraphNode>) => {
    // Since some operations' inner text may exceed its Node's width
    // we need to increase the Node's height accordingly and split the text
    // This process must be here after all the nodes are in the list
    const textSplitCalculation = (nodeWidth: number, textToCalculate: string): string[] => {
        const maximumLength = floor((nodeWidth - paddingLeftRight * 2) / textSizingFactor) - 2;
        if (textToCalculate.length > maximumLength) {
            let indexOfSplitLocation;
            // Traversing the splitting location backwards to find the beginning of the word
            for (indexOfSplitLocation = maximumLength; indexOfSplitLocation >= 0; indexOfSplitLocation -= 1) {
                if (textToCalculate[indexOfSplitLocation] === ' ') {
                    break;
                }
            }
            const textArr = textSplitCalculation(nodeWidth, textToCalculate.substring(indexOfSplitLocation + 1));
            textArr.unshift(textToCalculate.substring(0, indexOfSplitLocation + 1));
            return textArr;
        }
        return [textToCalculate];
    };
    Object.values(allSubgraphs).forEach(subGraph => {
        if (!isLeafNode(subGraph)) {
            subGraph.layoutOptions = subGraphLayoutOptions;
        } else {
            // if leaf and not the 'edges' object
            const labels = subGraph.labels[0];
            labels.text = capitalize(lowerCase(labels.text));
            let numberOfSplits = 0;
            if (labels.text) {
                const textToCalculate = textSplitCalculation(subGraph.width!, labels.text);
                // Each element in the resulting array will be rendered in a separate <text> element
                labels.displayTitle = textToCalculate;
                numberOfSplits += textToCalculate.length - 1;
            }
            // Description text
            const tempArr = [];
            if (labels.operation) {
                tempArr.push(labels.operation);
            }
            const { state } = labels;
            if (state) {
                const retriesCount = labels.retry;
                tempArr.push(state === 'Pending' && retriesCount ? `Pending retry (${retriesCount})` : state);
            }
            const textToCalculate = textSplitCalculation(subGraph.width!, tempArr.join(' - '));
            // Each element in the resulting array will be rendered in a separate <text> element
            labels.displayText = textToCalculate;
            numberOfSplits += textToCalculate.length - 1;
            if (numberOfSplits > 0) {
                subGraph.height! += textHeight * numberOfSplits;
            }
            subGraph.height! += 10;
        }
    });
    return allSubgraphs;
};

export const cleanSubgraphsList = (allSubgraphs: Record<string, any>, edges: any[]) => {
    // Removing irrelevant vertices (when a task is rescheduled due to failure mostly)
    safeDeleteIrrelevantGraphVertices(allSubgraphs);
    // Removing subgraphs with 0 children
    Object.keys(allSubgraphs).forEach(nodeKey => {
        const subGraph = allSubgraphs[nodeKey];
        if (isLeafNode(subGraph) && !isEmpty(subGraph.labels) && subGraph.labels[0].type === subgraphTask) {
            // Verify the subGraph doesn't have connected edges
            if (subGraph.containingSubgraph !== null) {
                let i = allSubgraphs[subGraph.containingSubgraph].edges.length;
                while (i) {
                    i -= 1;
                    if (
                        allSubgraphs[subGraph.containingSubgraph].edges[i].sources.indexOf(subGraph.id) > -1 ||
                        allSubgraphs[subGraph.containingSubgraph].edges[i].targets.indexOf(subGraph.id) > -1
                    ) {
                        allSubgraphs[subGraph.containingSubgraph].edges.splice(i, 1);
                    }
                }
            } else {
                let i = edges.length;
                while (i) {
                    i -= 1;
                    if (edges[i].sources.indexOf(subGraph.id) > -1 || edges[i].targets.indexOf(subGraph.id) > -1) {
                        edges.splice(i, 1);
                    }
                }
            }
            delete allSubgraphs[nodeKey];
        }
    });

    Object.keys(allSubgraphs).forEach(nodeKey => {
        // Return all the nodes that are root-level subgraphs
        const subGraph = allSubgraphs[nodeKey];
        const { containingSubgraph } = subGraph;
        delete subGraph.containingSubgraph;
        if (containingSubgraph) delete allSubgraphs[nodeKey];
    });

    return allSubgraphs;
};

export const createELKTasksGraphs = (allSubgraphs: Record<string, any>, edges: any[]): ElkNode => {
    return {
        id: 'tasksGraph',
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.spacing.nodeNode': '30f', // Vertical spacing between nodes in each layer
            'layered.spacing.nodeNodeBetweenLayers': '50f', // Horizontal spacing between layers
            hierarchyHandling: 'INCLUDE_CHILDREN' // To ensure inner nodes can have proper edges to nodes with different parents
        },
        children: Object.values(allSubgraphs),
        edges
    };
};
