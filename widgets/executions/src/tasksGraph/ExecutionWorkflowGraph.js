/**
 * Created by barucoh on 23/1/2019.
 */
import PropTypes from 'prop-types';

import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

const POLLING_INTERVAL = 5000

let self = null; // Required for the setTimeout function which changes the scope for 'this'

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
        self = this;
    }
    componentDidMount() {
        this._startPolling();
    }
    componentWillUnmount() {
        this._stopPolling();
    }
    _startPolling() {
        self.cancelablePromise = Stage.Utils.makeCancelable(self._getTasksGraphPromise());
        self.cancelablePromise.promise
            .then((tasksGraph) => {
                if (self.state.graphResult !== tasksGraph) {
                    self.setState({
                        graphResult: tasksGraph
                    })
                }
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.status === 404)
                    errorMessage = 'The selected execution does not have a tasks graph';
                self.setState({error: errorMessage});
                console.debug(error);
                self._stopPolling();
            });
        self.timer = setTimeout(self._startPolling, POLLING_INTERVAL);
    }
    _stopPolling() {
        clearTimeout(this.timer);
        this.timer = null;
        if (this.cancelablePromise)
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
        let {ErrorMessage, Loading} = Stage.Basic;
        if (this.state.graphResult !== null) {
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
        else if (this.state.error) {
            return (
                <div id='graphContainer'>
                    <ErrorMessage error={this.state.error} />
                </div>
            )
        }
        else {
            return (
                <div id='graphContainerLoading'>
                    <Loading />
                </div>
            )
        }
    }
}