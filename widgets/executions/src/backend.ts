// @ts-nocheck File not migrated fully to TS
export default r => {
    r.register('get_tasks_graph', 'GET', (req, res, next, helper) => {
        /**
         * ### Due to the nature of widgetBackend, the whole logic of a function must be placed inside that function
         * ### and cannot be separated to several functions :(
         *
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
        const ELK = require('elkjs');
        const _ = require('lodash');

        const elk = new ELK();
        const logger = helper.Logger();

        const tasksGraphsFetchUrl = '/tasks_graphs';
        const operationsFetchUrl = '/operations';
        const subgraphTask = 'SubgraphTask';

        // ELK Tasks graph skeleton
        const tasksGraph = {
            id: 'tasksGraph',
            layoutOptions: {
                'elk.algorithm': 'layered',
                'elk.spacing.nodeNode': '30f', // Vertical spacing between nodes in each layer
                'layered.spacing.nodeNodeBetweenLayers': '50f', // Horizontal spacing between layers
                hierarchyHandling: 'INCLUDE_CHILDREN' // To ensure inner nodes can have proper edges to nodes with different parents
            },
            children: [],
            edges: []
        };
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

        const isLeafNode = subGraph => _.isEmpty(subGraph.children);
        const constructSubgraphs = operationsList => {
            // All the subgraphs and leaves are in the same list for better time-complexity performance, meaning -
            // For every subgraph - instead of traversing its children until we find the desired subgraph/leaf, we simply
            // keep the child (or grand child) subgraph/leaf in the first-tier list as a pointer to the real child.
            // When we're done creating the skeleton for ELK, we remove all the pointers and only keep the root subgraphs.
            const allSubgraphs = {};
            _.map(operationsList, task => {
                let taskName = _.split(task.name, 'cloudify.interfaces.');
                taskName = taskName.length > 1 ? taskName[1] : _.upperFirst(taskName[0]);

                let taskOperation = '';
                const taskArgs = task.parameters.task_kwargs;
                if (taskArgs.cloudify_context && taskArgs.cloudify_context.operation) {
                    taskOperation = taskArgs.cloudify_context.operation.name;
                    taskOperation = _.split(taskOperation, 'cloudify.interfaces.');
                    taskOperation = taskOperation.length > 1 ? taskOperation[1] : taskOperation[0];
                    taskOperation = _.capitalize(_.lowerCase(taskOperation));
                }

                const cloudifyContext = _.get(taskArgs.kwargs, '__cloudify_context', {});
                let subGraph = {
                    // subGraph can be a subGraph or a 'leaf'
                    id: task.id,
                    labels: [
                        {
                            text: taskName,
                            retry: 0,
                            type: task.type,
                            state: _.upperFirst(task.state),
                            operation: taskOperation,
                            displayText: ''
                        }
                    ],
                    nodeInstanceId: cloudifyContext.node_id,
                    operation: _.get(cloudifyContext.operation, 'name'),
                    children: [],
                    edges: [],
                    containingSubgraph: null
                };
                if (!Object.prototype.hasOwnProperty.call(allSubgraphs, task.id)) {
                    allSubgraphs[task.id] = subGraph;
                } else {
                    allSubgraphs[task.id].labels[0].text = taskName;
                    allSubgraphs[task.id].labels[0].type = task.type;
                    allSubgraphs[task.id].labels[0].operation = taskOperation;
                    subGraph = allSubgraphs[task.id];
                }
                if (task.parameters.containing_subgraph) {
                    // Task is inside a Subgraph (could be subgraph in subgraph)
                    // Need to create its parent and update self as its child
                    const { containing_subgraph: containingSubgraph } = task.parameters;
                    subGraph.containingSubgraph = containingSubgraph;
                    if (!Object.prototype.hasOwnProperty.call(allSubgraphs, containingSubgraph)) {
                        // Parent does not exist - creating parent skeleton to be filled later
                        const parentGraph = {
                            id: containingSubgraph,
                            labels: [{ state: null }],
                            children: [subGraph],
                            edges: [],
                            containingSubgraph: null
                        };
                        allSubgraphs[containingSubgraph] = parentGraph;
                    } else {
                        // parentGraph already exists - only update its children and its child that its contained in it
                        allSubgraphs[containingSubgraph].children.push(subGraph);
                        allSubgraphs[containingSubgraph].labels[0].state = null;
                        allSubgraphs[task.id].containingSubgraph = containingSubgraph;
                    }

                    if (task.dependencies) {
                        // Updating task dependencies not to include containing_subgraph
                        task.dependencies = task.dependencies.filter(
                            taskId => taskId !== task.parameters.containing_subgraph
                        );
                    }
                }
            });
            return allSubgraphs;
        };
        const constructDependencies = (operationsList, allSubgraphs) => {
            // Connecting all the operations into a graph
            // *IMPORTANT NOTE* - Retrying tasks depend on their previous failed task
            allSubgraphs.edges = [];
            _.map(operationsList, task => {
                if (task.parameters.current_retries > 0) {
                    allSubgraphs[task.id].labels[0].retry = task.parameters.current_retries;
                }
                if (isLeafNode(allSubgraphs[task.id])) {
                    allSubgraphs[task.id].width = 270;
                    allSubgraphs[task.id].height = 40;
                }
                _.map(operationsList, dependantTask => {
                    const edge = {
                        id: '',
                        sources: [],
                        targets: []
                    };
                    if (
                        dependantTask.dependencies.indexOf(task.id) > -1 ||
                        dependantTask.parameters.retried_task === task.id
                    ) {
                        edge.id = `${task.id}_${dependantTask.id}`;
                        edge.sources.push(task.id);
                        edge.targets.push(dependantTask.id);
                        const { containingSubgraph } = allSubgraphs[task.id];
                        if (containingSubgraph === null) {
                            allSubgraphs.edges.push(edge);
                        } else {
                            allSubgraphs[containingSubgraph].edges.push(edge);
                        }
                    }
                });
            });
            return allSubgraphs;
        };
        const shouldHideTask = workflowTask => {
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
            return workflowTask.labels[0].retry > 0 || _.includes(typesToHide, workflowTask.labels[0].type);
        };
        const safeDeleteIrrelevantGraphVertices = allSubgraphs => {
            // Remove send-event, set-state, and retrying-tasks from the graph
            // while keeping it connected
            const existingEdges = new Set(); // Used to remove duplicate edges
            _.map(allSubgraphs, subGraph => {
                if (subGraph.children && subGraph.children.length > 0) {
                    // Go through all the subgraphs
                    // eslint-disable-next-line consistent-return
                    subGraph.children = _.map(subGraph.children, workflowTask => {
                        // For each subgraph, go through all the tasks
                        if (shouldHideTask(workflowTask)) {
                            // For each hidden task, connect the 'target'
                            // edges to it's parents' 'target' edges
                            // Remove the node when done
                            const sourceNodes = [];
                            const targetNodes = [];
                            // Need to go through the array twice because the
                            // update of the rest of the edges must be after all the
                            // "Node to remove"'s edges have been scanned
                            // eslint-disable-next-line consistent-return
                            subGraph.edges = _.map(subGraph.edges, edge => {
                                const sourceNode = edge.sources[0];
                                const targetNode = edge.targets[0];
                                if (sourceNode === workflowTask.id) {
                                    targetNodes.push(targetNode);
                                } else if (targetNode === workflowTask.id) {
                                    sourceNodes.push(sourceNode);
                                    if (workflowTask.labels[0].retry > 0) {
                                        // If a task is retrying - delete it and combine it with its father
                                        allSubgraphs[sourceNode].labels[0].retry = workflowTask.labels[0].retry;
                                        allSubgraphs[sourceNode].labels[0].state = workflowTask.labels[0].state;
                                        allSubgraphs[sourceNode].labels[0].displayText =
                                            workflowTask.labels[0].displayText;
                                    }
                                } else {
                                    return edge;
                                }
                            }).filter(edge => edge !== undefined);
                            _.map(sourceNodes, sourceNodeId => {
                                _.map(targetNodes, targetNodeId => {
                                    const newEdge = {
                                        id: `${sourceNodeId}_${targetNodeId}`,
                                        sources: [`${sourceNodeId}`],
                                        targets: [`${targetNodeId}`]
                                    };
                                    if (!existingEdges.has(newEdge.id)) {
                                        subGraph.edges.push(newEdge);
                                        existingEdges.add(newEdge.id);
                                    }
                                });
                            });
                        } else {
                            return workflowTask;
                        }
                    }).filter(workflowTask => workflowTask !== undefined);
                }
            });
            return allSubgraphs;
        };
        const adjustingNodeSizes = allSubgraphs => {
            // Since some operations' inner text may exceed its Node's width
            // we need to increase the Node's height accordingly and split the text
            // This process must be here after all the nodes are in the list
            const textSplitCalculation = (nodeWidth, textToCalculate) => {
                const maximumLength = _.floor((nodeWidth - paddingLeftRight * 2) / textSizingFactor) - 2;
                if (textToCalculate.length > maximumLength) {
                    let indexOfSplitLocation;
                    // Traversing the splitting location backwards to find the beginning of the word
                    for (indexOfSplitLocation = maximumLength; indexOfSplitLocation >= 0; indexOfSplitLocation -= 1) {
                        if (textToCalculate[indexOfSplitLocation] === ' ') {
                            break;
                        }
                    }
                    const textArr = textSplitCalculation(
                        nodeWidth,
                        textToCalculate.substring(indexOfSplitLocation + 1)
                    );
                    textArr.unshift(textToCalculate.substring(0, indexOfSplitLocation + 1));
                    return textArr;
                }
                return [textToCalculate];
            };
            _.map(allSubgraphs, subGraph => {
                if (subGraph.children) {
                    if (!isLeafNode(subGraph)) {
                        subGraph.layoutOptions = subGraphLayoutOptions;
                    } else {
                        // if leaf and not the 'edges' object
                        const labels = subGraph.labels[0];
                        labels.text = _.capitalize(_.lowerCase(labels.text));
                        let numberOfSplits = 0;
                        let textToCalculate = '';
                        if (labels.text) {
                            textToCalculate = labels.text;
                            textToCalculate = textSplitCalculation(subGraph.width, textToCalculate);
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
                            tempArr.push(
                                state === 'Pending' && retriesCount ? `Pending retry (${retriesCount})` : state
                            );
                        }
                        textToCalculate = tempArr.join(' - ');
                        textToCalculate = textSplitCalculation(subGraph.width, textToCalculate);
                        // Each element in the resulting array will be rendered in a separate <text> element
                        labels.displayText = textToCalculate;
                        numberOfSplits += textToCalculate.length - 1;
                        if (numberOfSplits > 0) {
                            subGraph.height += textHeight * numberOfSplits;
                        }
                        subGraph.height += 10;
                    }
                }
            });
            return allSubgraphs;
        };
        const cleanSubgraphsList = subgraphs => {
            // Removing irrelevant vertices (when a task is rescheduled due to failure mostly)
            let allSubgraphs = safeDeleteIrrelevantGraphVertices(subgraphs);
            // Removing subgraphs with 0 children
            // eslint-disable-next-line consistent-return
            allSubgraphs = _.omitBy(allSubgraphs, subGraph => {
                if (isLeafNode(subGraph) && !_.isEmpty(subGraph.labels) && subGraph.labels[0].type === subgraphTask) {
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
                        let i = allSubgraphs.edges.length;
                        while (i) {
                            i -= 1;
                            if (
                                allSubgraphs.edges[i].sources.indexOf(subGraph.id) > -1 ||
                                allSubgraphs.edges[i].targets.indexOf(subGraph.id) > -1
                            ) {
                                allSubgraphs.edges.splice(i, 1);
                            }
                        }
                    }
                    return true;
                }
            });
            allSubgraphs = _.omitBy(allSubgraphs, subGraph => {
                // Return all the nodes that are root-level subgraphs
                const { containingSubgraph } = subGraph;
                delete subGraph.containingSubgraph;
                return containingSubgraph;
            });
            return allSubgraphs;
        };
        const createELKTasksGraphs = subgraphs => {
            let allSubgraphs = subgraphs;
            tasksGraph.edges = allSubgraphs.edges;
            allSubgraphs = _.omit(allSubgraphs, ['edges']);
            _.map(allSubgraphs, subGraph => {
                tasksGraph.children.push(subGraph);
            });
            return tasksGraph;
        };
        const runGraphCreation = () => {
            const params = { ...req.query };
            const headers = _.pick(req.headers, 'authentication-token', 'tenant');

            const operationsList = [];
            helper.Manager.doGet(tasksGraphsFetchUrl, { params, headers })
                .then(data => {
                    const { items } = data;

                    if (_.isEmpty(items)) {
                        const message = `No tasks graph for execution id=${params.execution_id}.`;
                        logger.info(message);
                        res.status(404).send({ message });
                        return;
                    }

                    const operationsPromises = _.map(items, graph =>
                        // eslint-disable-next-line camelcase
                        helper.Manager.doGet(operationsFetchUrl, { params: { graph_id: graph.id }, headers })
                    );

                    Promise.all(operationsPromises)
                        .then(results => {
                            _.map(results[0].items, item => {
                                operationsList.push(item);
                            });
                            return operationsList;
                        })
                        .then(list => {
                            // Constructing SubGraphs
                            let allSubgraphs = constructSubgraphs(list);
                            // Constructing Dependencies
                            allSubgraphs = constructDependencies(list, allSubgraphs);
                            // Increase the Node's rectangle height based on inner texts
                            allSubgraphs = adjustingNodeSizes(allSubgraphs);
                            // Remove LocalWorkflow & NOPWorkflowTasks from the graph while keeping it connected
                            allSubgraphs = cleanSubgraphsList(allSubgraphs);
                            // Creating the ELK-formatted graph
                            return createELKTasksGraphs(allSubgraphs);
                        })
                        .then(graphs => elk.layout(graphs))
                        .then(elkGraph => res.send(elkGraph))
                        .catch(error => {
                            logger.error(error);
                            next(error);
                        });
                })
                .catch(error => {
                    logger.error(error);
                    next(error);
                });
        };

        runGraphCreation();
    });
};
