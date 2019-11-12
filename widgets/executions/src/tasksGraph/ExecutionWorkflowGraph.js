/**
 * Created by barucoh on 23/1/2019.
 */
import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

const POLLING_INTERVAL = 5000;

export default class ExecutionWorkflowGraph extends React.Component {
    /**
     * @property {Any} [selectedExecution] - Used to pull the execution's tasks graphs and corresponding operations' lists
     */
    static propTypes = {
        selectedExecution: PropTypes.any.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            graphResult: null,
            error: ''
        };
        this.timer = null;
        this.cancelablePromise = null;
        this.startPolling = this.startPolling.bind(this); // Required for the setTimeout function which changes the scope for 'this'
    }

    componentDidMount() {
        this.startPolling();
    }

    componentWillUnmount() {
        this.stopPolling();
    }

    startPolling() {
        this.cancelablePromise = Stage.Utils.makeCancelable(this.getTasksGraphPromise());
        this.cancelablePromise.promise
            .then(tasksGraph => {
                if (this.state.graphResult !== tasksGraph) {
                    this.setState({
                        graphResult: tasksGraph
                    });
                }
            })
            .catch(error => {
                let errorMessage = error.message;
                if (error.status === 404) errorMessage = 'The selected execution does not have a tasks graph';
                this.setState({ error: errorMessage });
                console.debug(error);
                this.stopPolling();
            });
        this.timer = setTimeout(this.startPolling, POLLING_INTERVAL);
    }

    stopPolling() {
        clearTimeout(this.timer);
        this.timer = null;
        if (this.cancelablePromise) this.cancelablePromise.cancel();
    }

    getTasksGraphPromise() {
        const tasksGraphParams = {
            execution_id: this.props.selectedExecution.id,
            name: this.props.selectedExecution.workflow_id
        };
        return this.props.widgetBackend.doGet('get_tasks_graph', { ...tasksGraphParams });
    }

    render() {
        const { Header, Loading, Message } = Stage.Basic;
        if (this.state.graphResult !== null) {
            return (
                <div id="graphContainer">
                    <svg height={this.state.graphResult.height} width={this.state.graphResult.width}>
                        <GraphNodes graphNodes={this.state.graphResult.children} />
                        <GraphEdges graphEdges={this.state.graphResult.edges} />
                    </svg>
                </div>
            );
        }
        if (this.state.error) {
            return (
                <div id="graphContainer">
                    <Message>
                        <Message.Header>Note</Message.Header>
                        <p>This execution has no tasks graph to display.</p>
                    </Message>
                </div>
            );
        }

        return (
            <div id="graphContainerLoading">
                <Loading />
            </div>
        );
    }
}
