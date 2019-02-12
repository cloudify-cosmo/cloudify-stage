/**
 * Created by barucoh on 23/1/2019.
 */
import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

export default class ExecutionWorkflowGraph extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphResult: undefined
        };
    }
    componentDidMount() {
        const tasksGraphParams = {
            execution_id: this.props.selectedExecution.id,
            name: this.props.selectedExecution.workflow_id
        }
        console.log('bla');
        this.props.widgetBackend.doGet('get_tasks_graph', {...tasksGraphParams})
            .then((tasksGraph) => {
                if (this.state.graphResult !== tasksGraph) {
                    this.setState({
                        graphResult: tasksGraph
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
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