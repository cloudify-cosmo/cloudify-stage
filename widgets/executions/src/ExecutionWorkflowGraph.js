/**
 * Created by barucoh on 23/1/2019.
 */
import ELK from 'elkjs/lib/elk.bundled.js';

import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

const elk = new ELK();

const tasksGraphsFetchUrl = '/tasks_graphs'
const operationsFetchUrl = '/operations'

const LocalWorkflowTask = 'LocalWorkflowTask'
const NOPLocalWorkflowTask = 'NOPLocalWorkflowTask'
const RemoteWorkflowTask = 'RemoteWorkflowTask'
const SubgraphTask = 'SubgraphTask'

const graph = {
    id: "root",
    layoutOptions: { 
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '20f',
        'layered.spacing.nodeNodeBetweenLayers': '20f'
    },
    children: [
      { id: "n1", width: 30, height: 30, labels: [{text: '1'}] },
      { id: "n2", width: 30, height: 30, labels: [{text: '2'}] },
      { id: "n3", width: 30, height: 30, labels: [{text: '3'}] },
      { id: "n4", width: 30, height: 30, labels: [{text: '4'}] },
      {
          id: "n5",
          children: [
            { id: "n6", width: 30, height: 30, labels: [{text: '5'}] },
            { id: "n7", width: 30, height: 30, labels: [{text: '6'}] },
            { id: "n8", width: 30, height: 30, labels: [{text: '7'}] }
          ],
          edges: [
            { id: "e6", sources: [ "n6" ], targets: [ "n7" ] },
            { id: "e7", sources: [ "n6" ], targets: [ "n8" ] },
            { id: "e7", sources: [ "n7" ], targets: [ "n8" ] }
          ],
          labels: [{text: '8 - containing graph'}]
      }
    ],
    edges: [
      { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
      { id: "e2", sources: [ "n1" ], targets: [ "n3" ] },
      { id: "e3", sources: [ "n1" ], targets: [ "n4" ] },
      { id: "e4", sources: [ "n2" ], targets: [ "n5" ] },
      { id: "e5", sources: [ "n2" ], targets: [ "n3" ] }
    ]
  }

export default class ExecutionWorkflowGraph extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphResult: undefined
        };
        this.toolbox = Stage.Utils.getToolbox(()=>{}, ()=>{}, null);
    }
    _safeDeleteIrrelevantGraphVertices(allSubgraphs) {
        _.map(allSubgraphs, (subGraph) => {
            if (subGraph.children && subGraph.children.length > 0) { // Go through all the subgraphs
                _.map(subGraph.children, (workflowTask) => { // For each subgraph, go through all the tasks
                    debugger;
                    if (workflowTask.labels[0].type === LocalWorkflowTask ||
                        workflowTask.labels[0].type === NOPLocalWorkflowTask) {
                        // Remove all LocalWorkflowTasks and NOPWorkflowTasks from the subgraph
                        // Connect its 'target' edges to it's parents' 'target' edges
                        // Remove the node when done
                        let sourceNodes = [];
                        let targetNodes = [];
                        // Need to go through the array twice because the 
                        // update of the rest of edges must be after all the
                        // "Node to remove"'s edges have been scanned
                        _.map(subGraph.edges, (edge, index) => {
                            let sourceNode = edge.sources[0]
                            let targetNode = edge.targets[0]
                            if (sourceNode === workflowTask.id) {
                                targetNodes.push(targetNode);
                                subGraph.edges.splice(index, 1);
                            }
                            else if (targetNode === workflowTask.id) {
                                sourceNodes.push(sourceNode);
                                subGraph.edges.splice(index, 1);
                            }
                        });
                        _.map(sourceNodes, (sourceNodeId) => {
                            _.map(targetNodes, (targetNodeId) => {
                                let newEdge = {
                                    id: `${sourceNodeId}_${targetNodeId}`,
                                    sources: [`${sourceNodeId}`],
                                    targets: [`${targetNodeId}`]
                                }
                                subGraph.edges.push(newEdge);
                            })
                        })
                    }
                })
            }
        })
        return allSubgraphs;
    }
    componentDidMount() {
        let tasksGraphParams = {
            execution_id: this.props.selectedExecution.id,
            name: this.props.selectedExecution.workflow_id
        }
        let manager = this.toolbox.getManager();
        let subGraphAndRemoteWorkflowTasks = []
        manager.doGet(tasksGraphsFetchUrl, tasksGraphParams)
            .then((data) => {
                //console.log(data);
                const operationsPromises = _.map(data.items, (graph) => manager.doGet(operationsFetchUrl, {graph_id: graph.id}));
                Promise.all(operationsPromises)
                .then((results) => {
                    _.map(results[0].items, (item) => {
                        if (true) { //item.id == '005f62c9-4f75-448f-aa16-b05c0dffb391' || item.dependencies.indexOf('005f62c9-4f75-448f-aa16-b05c0dffb391') > -1 || item.parameters.containing_subgraph == '005f62c9-4f75-448f-aa16-b05c0dffb391') {// || item.type === "RemoteWorkflowTask") {
                            console.log(item);
                            subGraphAndRemoteWorkflowTasks.push(item);
                        }
                    })
                    console.log(results);
                    return subGraphAndRemoteWorkflowTasks;
                })
                .then((subGraphAndRemoteWorkflowTasks) => {
                    //console.log(subGraphAndRemoteWorkflowTasks);
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
                    let index = 0;
                    // Constructing SubGraphs
                    _.map(subGraphAndRemoteWorkflowTasks, (task) => {
                        let subGraph = {
                            id: task.id,
                            labels: [{
                                    text: task.parameters.info,
                                    retry: '',
                                    type: task.type
                                }],
                            children: [],
                            edges: [],
                            containing_subgraph: null // Needed to distinguish which nodes to keep (=not null will be removed)
                        }
                        if (!allSubgraphs.hasOwnProperty(task.id)) {
                            allSubgraphs[task.id] = subGraph;
                        }
                        if (task.parameters.containing_subgraph) {
                            let containing_subgraph = task.parameters.containing_subgraph;
                            subGraph.containing_subgraph = containing_subgraph;
                            if (!allSubgraphs.hasOwnProperty(containing_subgraph)) {
                                let parentGraph = {
                                    id: containing_subgraph,
                                    labels: [{text: '', index: ''}],
                                    children: [ subGraph ],
                                    edges: [],
                                    containing_subgraph: null
                                }
                                allSubgraphs[containing_subgraph] = parentGraph
                            }
                            else { // parentGraph already exists - only update its children and it's child that's it is contained in it
                                allSubgraphs[containing_subgraph].children.push(subGraph);
                                allSubgraphs[task.id].containing_subgraph = containing_subgraph;
                            }
                        }
                    })
                    // Constructing Dependencies
                    _.map(subGraphAndRemoteWorkflowTasks, (task) => {
                        allSubgraphs[task.id].labels[0].text = task.name;
                        if (task.parameters.info)
                            allSubgraphs[task.id].labels[0].text += ' - ' + task.parameters.info
                        if (task.parameters.task_kwargs && task.parameters.task_kwargs.cloudify_context)
                            allSubgraphs[task.id].labels[0].retry = task.parameters.task_kwargs.cloudify_context.operation.retry_number;
                        //if (allSubgraphs[task.id].containing_subgraph) { // TODO: Add check isLeaf
                        allSubgraphs[task.id].width = 270
                        allSubgraphs[task.id].height = 40
                        //}
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
                                if (containing_subgraph === null) {
                                    allSubgraphs.edges.push(edge);
                                }
                                else {
                                    allSubgraphs[containing_subgraph].edges.push(edge);
                                }
                            }
                        });
                        index++;
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
        /*elk.layout(graph)
            .then((g) => {
                if (this.state.graphResult !== g)
                {
                    this.setState({
                        graphResult: g
                    })
                }
            })
            .catch(console.error)*/
    }
    render() {
        console.log(this.state.graphResult);
        if (this.state.graphResult !== undefined) {
            return (
                <div id='graphContainer'>
                    <svg
                        height={this.state.graphResult.height}
                        width={this.state.graphResult.width}
                    >
                        <GraphNodes graphNodes={this.state.graphResult.children} />
                        <GraphEdges graphEdges={this.state.graphResult.edges} />
                    </svg>
                </div>
            )
        }
        else {
            return (
                <div id='graphContainer'>
                    <label>Loading...</label>
                </div>
            )
        }
    }
}