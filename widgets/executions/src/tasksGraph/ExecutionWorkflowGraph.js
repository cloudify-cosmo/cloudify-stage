/**
 * Created by barucoh on 23/1/2019.
 */
import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

const POLLING_INTERVAL = 5000

export default class ExecutionWorkflowGraph extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphResult: undefined
        };
        this.timer = null;
        this.cancelablePromise = null;
    }
    componentDidMount() {
        // Polling the tasks graph every 5 seconds for any updates
        this.timer = setInterval(() => {
            this.cancelablePromise = Stage.Utils.makeCancelable(this._getTasksGraphPromise());
            this.cancelablePromise.promise
                .then((tasksGraph) => {
                    debugger;
                    if (this.state.graphResult !== tasksGraph) {
                        this.setState({
                            graphResult: tasksGraph
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }, POLLING_INTERVAL);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
        this.cancelablePromise.cancel();
    }
    _getTasksGraphPromise() {
        const tasksGraphParams = {
            execution_id: this.props.selectedExecution.id,
            name: this.props.selectedExecution.workflow_id
        }
        return this.props.widgetBackend.doGet('get_tasks_graph', {...tasksGraphParams});
    }
    render() {
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