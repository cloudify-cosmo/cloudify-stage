/**
 * Created by barucoh on 11/2/2019.
 */

module.exports = (r) => {
    r.register('operations', 'GET', (req, res, helper) => {
        const tasksGraphsFetchUrl = '/tasks_graphs';
        const operationsFetchUrl = '/operations';
        
        const LocalWorkflowTask = 'LocalWorkflowTask';
        const NOPLocalWorkflowTask = 'NOPLocalWorkflowTask';

        const _safeDeleteIrrelevantGraphVertices = (allSubgraphs) => {
            let existingEdges = new Set(); // Used to remove deuplicate edges
            _.map(allSubgraphs, (subGraph) => {
                if (subGraph.children && subGraph.children.length > 0) { // Go through all the subgraphs
                    subGraph.children = _.map(subGraph.children, (workflowTask) => {
                        // For each subgraph, go through all the tasks
                        if (workflowTask.labels[0].type === LocalWorkflowTask ||
                            workflowTask.labels[0].type === NOPLocalWorkflowTask ||
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
                                    if (workflowTask.labels[0].retry > 0)
                                        allSubgraphs[sourceNode].labels[0].retry = workflowTask.labels[0].retry;
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
        debugger;
        // let _ = require('loadsh');
        let headers = req.headers;
        let tasksGraphParams = {...req.query};

        let subGraphAndRemoteWorkflowTasks = []
        helper.Manager.doGet(tasksGraphsFetchUrl, tasksGraphParams)
            .then((data) => {
                debugger;
                console.log(data);
            })
        })
        let tasksGraphParams = {
            execution_id: this.props.selectedExecution.id,
            name: this.props.selectedExecution.workflow_id
        }
        let manager = this.toolbox.getManager();
        let subGraphAndRemoteWorkflowTasks = []
        manager.doGet(tasksGraphsFetchUrl, tasksGraphParams)
            .then((data) => {
                const operationsPromises = _.map(data.items, (graph) => manager.doGet(operationsFetchUrl, {graph_id: graph.id}));
                Promise.all(operationsPromises)
                .then((results) => {
                    _.map(results[0].items, (item) => {
                        console.log(item);
                        subGraphAndRemoteWorkflowTasks.push(item);
                    })
                    console.log(results);
                    return subGraphAndRemoteWorkflowTasks;
                })
                .then((subGraphAndRemoteWorkflowTasks) => {
                    // Constructing the graph
                    let tasksGraph = {
                        id: 'tasksGraph',
                        layoutOptions: { 
                            'elk.algorithm': 'layered',
                            'elk.spacing.nodeNode': '20f',
                            'layered.spacing.nodeNodeBetweenLayers': '30f'
                        },
                        children: [],
                        edges: []
                    }
                    let allSubgraphs = { 'edges': [] };
                    // Constructing SubGraphs
                    _.map(subGraphAndRemoteWorkflowTasks, (task) => {
                        let subGraph = {
                            id: task.id,
                            labels: [{
                                    text: task.parameters.info,
                                    retry: 0,
                                    type: task.type,
                                    state: task.state
                                }],
                            children: [],
                            edges: [],
                            containing_subgraph: null // Needed to distinguish which nodes to keep (=not null will be removed)
                        }
                        if (!allSubgraphs.hasOwnProperty(task.id)) {
                            allSubgraphs[task.id] = subGraph;
                        }
                        else {
                            allSubgraphs[task.id].labels[0].text = task.parameters.info;
                            allSubgraphs[task.id].labels[0].type = task.type;
                            subGraph = allSubgraphs[task.id];
                        }
                        if (task.parameters.containing_subgraph) {
                            let containing_subgraph = task.parameters.containing_subgraph;
                            subGraph.containing_subgraph = containing_subgraph;
                            if (!allSubgraphs.hasOwnProperty(containing_subgraph)) {
                                let parentGraph = {
                                    id: containing_subgraph,
                                    labels: [{state: undefined}],
                                    children: [ subGraph ],
                                    edges: [],
                                    containing_subgraph: null
                                }
                                allSubgraphs[containing_subgraph] = parentGraph
                            }
                            else { // parentGraph already exists - only update its children and it's child that's it is contained in it
                                allSubgraphs[containing_subgraph].children.push(subGraph);
                                allSubgraphs[containing_subgraph].labels[0].state = undefined;
                                allSubgraphs[task.id].containing_subgraph = containing_subgraph;
                            }
                        }
                    })
                    // Constructing Dependencies
                    _.map(subGraphAndRemoteWorkflowTasks, (task) => {
                        allSubgraphs[task.id].labels[0].text = task.name;
                        // if (task.parameters.info)
                        //     allSubgraphs[task.id].labels[0].text += ' - ' + task.parameters.info
                        if (task.parameters.current_retries > 0)
                            allSubgraphs[task.id].labels[0].retry = task.parameters.current_retries;
                        if (allSubgraphs[task.id].containing_subgraph) {
                            allSubgraphs[task.id].width = 270
                            allSubgraphs[task.id].height = 40
                        }
                        _.map(subGraphAndRemoteWorkflowTasks, (dependantTask) => {
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
                    // Remove LocalWorkflow & NOPWorkflowTasks from the graph
                    // while keeping it connected
                    allSubgraphs = this._safeDeleteIrrelevantGraphVertices(allSubgraphs);
                    allSubgraphs = _.omitBy(allSubgraphs, (subGraph) => {
                        // Return all the nodes that are subgraphs
                        let containing_subgraph = subGraph.containing_subgraph;
                        delete subGraph.containing_subgraph;
                        return containing_subgraph;
                    });
                    tasksGraph.edges = allSubgraphs.edges;
                    allSubgraphs = _.omit(allSubgraphs, ['edges']);
                    _.map(allSubgraphs, (subGraph) => {
                        tasksGraph.children.push(subGraph);
                    });
                    return tasksGraph;
                })
                .then((tasksGraph) => {
                    elk.layout(tasksGraph)
                    .then((g) => {
                        if (this.state.graphResult !== g)
                        {
                            this.setState({
                                graphResult: g
                            })
                        }
                    })
                })
            })
            .catch(console.error);
}