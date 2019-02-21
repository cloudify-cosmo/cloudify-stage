/**
 * Created by barucoh on 11/2/2019.
 */

module.exports = (r) => {
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

        const tasksGraphsFetchUrl = '/tasks_graphs';
        const operationsFetchUrl = '/operations';
        
        const localWorkflowTask = 'LocalWorkflowTask';
        const nopLocalWorkflowTask = 'NOPLocalWorkflowTask';

        // ELK Tasks graph skeleton
        let tasksGraph = {
            id: 'tasksGraph',
            layoutOptions: { 
                'elk.algorithm': 'layered',
                'elk.spacing.nodeNode': '30f', // Vertical spacing between nodes in each layer
                'layered.spacing.nodeNodeBetweenLayers': '50f' // Horizontal spacing between layers
            },
            children: [],
            edges: []
        }
        const paddingLeftRight = 12;
        const paddingTop = 20;
        const paddingBottom = 16;
        const subGraphLayoutOptions = { 'elk.padding': `[top=${paddingTop},left=${paddingLeftRight},bottom=${paddingBottom},right=${paddingLeftRight}]` };

        // This is a rough estimate of how much space each character in a string takes.
        // This will be used when a text needs to be displayed inside a node (rectangle)
        // and exceeds its width, resulting in increasing the rectangle's height and 
        // breaking the string into 2 (and so forth...)
        const textSizingFactor = 5.6
        const textHeight = 18;

        const runGraphCreation = () => {
            const tasksGraphParams = {...req.query};
            
            let headers = req.headers;
            let operationsList = [];
            helper.Manager.doGet(tasksGraphsFetchUrl, tasksGraphParams, headers)
                .then((data) => {
                    headers = _.omit(headers, 'accept-encoding'); // Required otherwise the data is returned in bytes and screwed up
                    const operationsPromises = _.map(data.items, (graph) => helper.Manager.doGet(operationsFetchUrl, {graph_id: graph.id}, headers));
                    Promise.all(operationsPromises)
                    .then((results) => {
                        _.map(results[0].items, (item) => {
                            operationsList.push(item);
                        })
                        return operationsList;
                    })
                    .then((operationsList) => {
                        // Constructing SubGraphs
                        let allSubgraphs = _constructSubgraphs(operationsList);
                        // Constructing Dependencies
                        allSubgraphs = _constructDependencies(operationsList, allSubgraphs);
                        // Removing irrelevant vertices (when a task is rescheduled due to failure mostly)
                        allSubgraphs = _safeDeleteIrrelevantGraphVertices(allSubgraphs);
                        // Increase the Node's rectangle height based on inner texts
                        allSubgraphs = _adjustingNodeSizes(allSubgraphs);
                        // Remove LocalWorkflow & NOPWorkflowTasks from the graph while keeping it connected
                        allSubgraphs = _cleanSubgraphsList(allSubgraphs);
                        // Creating the ELK-formatted graph
                        return _createELKTasksGraphs(allSubgraphs);
                    })
                    .then((tasksGraph) => {
                        elk.layout(tasksGraph)
                        .then((elkGraph) => {
                            res.send(elkGraph);
                        })
                    })
                    .catch((error) => {
                        next(error);
                    });
                })
                .catch((error) => {
                    next(error);
                });
        };
        const _constructSubgraphs = (operationsList) => {
            // TODO: Add description to why all the subgraphs are in the same list
            let allSubgraphs = {};
            _.map(operationsList, (task) => {
                let taskName = _.split(task.name, 'cloudify.interfaces.');
                taskName = taskName.length > 1 ? taskName[1] : taskName[0];

                let taskOperation = '';
                if (task.parameters.task_kwargs.cloudify_context && task.parameters.task_kwargs.cloudify_context.operation) {
                    taskOperation = task.parameters.task_kwargs.cloudify_context.operation.name;
                    taskOperation = _.split(taskOperation, 'cloudify.interfaces.');
                    taskOperation = taskOperation.length > 1 ? taskOperation[1] : taskOperation[0];
                    taskOperation = _.capitalize(_.lowerCase(taskOperation));
                }

                let subGraph = { // subGraph can be a subGraph or a 'leaf'
                    id: task.id,
                    labels: [{
                            text: taskName,
                            retry: 0,
                            type: task.type,
                            state: task.state,
                            operation: taskOperation,
                            display_text: ''
                        }],
                    children: [],
                    edges: [],
                    containing_subgraph: null // Needed to distinguish which nodes to keep (=not null -> not root-level subgraphs -> will be removed)
                }
                if (!allSubgraphs.hasOwnProperty(task.id)) {
                    allSubgraphs[task.id] = subGraph;
                }
                else {
                    allSubgraphs[task.id].labels[0].text = taskName;
                    allSubgraphs[task.id].labels[0].type = task.type;
                    allSubgraphs[task.id].labels[0].operation = taskOperation;
                    subGraph = allSubgraphs[task.id];
                }
                if (task.parameters.containing_subgraph) {
                    // Task is inside a Subgraph (could be subgraph in subgraph)
                    // Need to create its parent and update self as its child
                    let containing_subgraph = task.parameters.containing_subgraph;
                    subGraph.containing_subgraph = containing_subgraph;
                    if (!allSubgraphs.hasOwnProperty(containing_subgraph)) { // Parent does not exist - creating parent skeleton to be filled later
                        let parentGraph = {
                            id: containing_subgraph,
                            labels: [{state: null}],
                            children: [ subGraph ],
                            edges: [],
                            containing_subgraph: null
                        }
                        allSubgraphs[containing_subgraph] = parentGraph
                    }
                    else { // parentGraph already exists - only update its children and its child that its contained in it
                        allSubgraphs[containing_subgraph].children.push(subGraph);
                        allSubgraphs[containing_subgraph].labels[0].state = null;
                        allSubgraphs[task.id].containing_subgraph = containing_subgraph;
                    }
                }
            });
            return allSubgraphs;
        }
        const _constructDependencies = (operationsList, allSubgraphs) => {
            allSubgraphs['edges'] = [];
            _.map(operationsList, (task) => {
                if (task.parameters.current_retries > 0)
                    allSubgraphs[task.id].labels[0].retry = task.parameters.current_retries;
                if (allSubgraphs[task.id].containing_subgraph) {
                    allSubgraphs[task.id].width = 270
                    allSubgraphs[task.id].height = 40
                }
                _.map(operationsList, (dependantTask) => {
                    let edge = {
                        id: '',
                        sources: [],
                        targets: []
                    }
                    if (dependantTask.dependencies.indexOf(task.id) > -1) {
                        edge.id = task.id + '_' + dependantTask.id;
                        edge.sources.push(task.id);
                        edge.targets.push(dependantTask.id);
                        let containing_subgraph = allSubgraphs[task.id].containing_subgraph;
                        if (containing_subgraph === null)
                            allSubgraphs.edges.push(edge);
                        else
                            allSubgraphs[containing_subgraph].edges.push(edge);
                    }
                });
            });
            return allSubgraphs;
        }
        const _safeDeleteIrrelevantGraphVertices = (allSubgraphs) => {
            // Remove LocalWorkflow & NOPWorkflowTasks from the graph
            // while keeping it connected
            let existingEdges = new Set(); // Used to remove deuplicate edges
            _.map(allSubgraphs, (subGraph) => {
                if (subGraph.children && subGraph.children.length > 0) { // Go through all the subgraphs
                    subGraph.children = _.map(subGraph.children, (workflowTask) => {
                        // For each subgraph, go through all the tasks
                        if (workflowTask.labels[0].type === localWorkflowTask ||
                            workflowTask.labels[0].type === nopLocalWorkflowTask ||
                            workflowTask.labels[0].retry > 0) {
                            // Remove all LocalWorkflowTasks and NOPWorkflowTasks from the subgraph
                            // Connect its 'target' edges to it's parents' 'target' edges
                            // Remove the node when done
                            let sourceNodes = [];
                            let targetNodes = [];
                            // Need to go through the array twice because the 
                            // update of the rest of the edges must be after all the
                            // "Node to remove"'s edges have been scanned
                            subGraph.edges = _.map(subGraph.edges, (edge) => {
                                let sourceNode = edge.sources[0]
                                let targetNode = edge.targets[0]
                                if (sourceNode === workflowTask.id) {
                                    targetNodes.push(targetNode);
                                }
                                else if (targetNode === workflowTask.id) {
                                    sourceNodes.push(sourceNode);
                                    if (workflowTask.labels[0].retry > 0) {
                                        allSubgraphs[sourceNode].labels[0].retry = workflowTask.labels[0].retry;
                                        allSubgraphs[sourceNode].labels[0].state = workflowTask.labels[0].state;
                                    }
                                }
                                else
                                    return edge;
                            }).filter((edge) => edge !== undefined);
                            _.map(sourceNodes, (sourceNodeId) => {
                                _.map(targetNodes, (targetNodeId) => {
                                    let newEdge = {
                                        id: `${sourceNodeId}_${targetNodeId}`,
                                        sources: [`${sourceNodeId}`],
                                        targets: [`${targetNodeId}`]
                                    }
                                    if (!existingEdges.has(newEdge.id)) {
                                        subGraph.edges.push(newEdge);
                                        existingEdges.add(newEdge.id);
                                    }
                                })
                            });
                        } else
                            return workflowTask;
                    }).filter((workflowTask) => workflowTask !== undefined);
                }
            });
            return allSubgraphs;
        }
        const _adjustingNodeSizes = (allSubgraphs) => {
            // Since some operations' inner text may exceed its Node's width
            // we need to increase the Node's height accordingly and split the text
            // This process must be here after all the nodes are in the list
            const _textSplitCalculation = (nodeWidth, textToCalculate) => {
                let maximumLength = _.floor((nodeWidth - (paddingLeftRight * 2)) / textSizingFactor);
                if (textToCalculate.length > maximumLength) {
                    let indexOfSplitLocation;
                    // Traversing the splitting location backwards to find the beginning of the word
                    for (indexOfSplitLocation = maximumLength; indexOfSplitLocation >= 0; indexOfSplitLocation--) {
                        if (textToCalculate[indexOfSplitLocation] == ' ')
                            break;
                    }
                    let textArr = _textSplitCalculation(
                        nodeWidth,
                        textToCalculate.substring(indexOfSplitLocation + 1)
                    )
                    textArr.unshift(textToCalculate.substring(0, indexOfSplitLocation + 1));
                    return textArr;
                }
                return [textToCalculate];
            }
            _.map(allSubgraphs, (subGraph) => {
                if (subGraph.containing_subgraph !== null && subGraph.labels)
                    subGraph.labels[0].text = _.capitalize(_.lowerCase(subGraph.labels[0].text));
                if (subGraph.children && subGraph.children.length !== 0)
                    subGraph.layoutOptions = subGraphLayoutOptions;
                if (subGraph.children && subGraph.children.length == 0) { // if leaf and not the 'edges' object
                    let numberOfSplits = 0;
                    let textToCalculate = '';
                    if (subGraph.labels[0].text) {
                        textToCalculate = subGraph.labels[0].text;
                        textToCalculate = _textSplitCalculation(subGraph.width, textToCalculate);
                        // Each element in the resulting array will be rendered in a separate <text> element 
                        subGraph.labels[0].display_title = textToCalculate;
                        numberOfSplits += textToCalculate.length - 1;
                    }
                    // Description text
                    let tempArr = [];
                    if (subGraph.labels[0].operation)
                        tempArr.push(subGraph.labels[0].operation);
                    if (subGraph.labels[0].state)
                        tempArr.push(subGraph.labels[0].state);
                    if (subGraph.labels[0].retry)
                        tempArr.push(subGraph.labels[0].retry);
                    textToCalculate = tempArr.join(' - ');
                    textToCalculate = _textSplitCalculation(subGraph.width, textToCalculate);
                    // Each element in the resulting array will be rendered in a separate <text> element 
                    subGraph.labels[0].display_text = textToCalculate;
                    numberOfSplits += textToCalculate.length - 1;
                    if (numberOfSplits > 0)
                        subGraph.height += textHeight * numberOfSplits;
                    /*else
                        subGraph.labels.operation = [textToCalculate];*/
                }
            })
            return allSubgraphs;
        }
        const _cleanSubgraphsList = (allSubgraphs) => {
            allSubgraphs = _.omitBy(allSubgraphs, (subGraph) => {
                // Return all the nodes that are root-level subgraphs
                let containing_subgraph = subGraph.containing_subgraph;
                delete subGraph.containing_subgraph;
                return containing_subgraph;
            });
            return allSubgraphs;
        }
        const _createELKTasksGraphs = (allSubgraphs) => {
            tasksGraph.edges = allSubgraphs.edges;
            allSubgraphs = _.omit(allSubgraphs, ['edges']);
            _.map(allSubgraphs, (subGraph) => {
                tasksGraph.children.push(subGraph);
            });
            return tasksGraph;
        }

        runGraphCreation();
    });
}