/**
 * Created by barucoh on 23/1/2019.
 */
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

const POLLING_INTERVAL = 5000;
const MAX_GRAPH_HEIGHT = 380;
const GRAPH_VERTICAL_MARGIN = 15;

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
            error: '',
            maximized: false,
            containerWidth: 0,
            modalWidth: 0
        };
        this.timer = null;
        this.cancelablePromise = null;
        this.startPolling = this.startPolling.bind(this); // Required for the setTimeout function which changes the scope for 'this'
        this.wrapper = React.createRef();
        this.modal = React.createRef();
    }

    componentDidMount() {
        this.startPolling();
    }

    componentDidUpdate() {
        const containerWidth = _.get(this.wrapper.current, 'offsetWidth');
        if (containerWidth && containerWidth !== this.state.containerWidth) {
            this.setState({ containerWidth });
        }
        const modalWidth = _.get(this.modal.current, 'offsetWidth');
        if (modalWidth && modalWidth !== this.state.modalWidth) {
            this.setState({ modalWidth });
        }
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

    renderGraph(width, height) {
        return (
            <UncontrolledReactSVGPanZoom
                width={width}
                height={height}
                background="#fff"
                tool="pan"
                miniatureProps={{ position: 'none' }}
                toolbarProps={{ position: 'none' }}
            >
                <svg>
                    <g transform={`translate(0, ${GRAPH_VERTICAL_MARGIN})`}>
                        <GraphNodes graphNodes={this.state.graphResult.children} />
                        <GraphEdges graphEdges={this.state.graphResult.edges} />
                    </g>
                </svg>
            </UncontrolledReactSVGPanZoom>
        );
    }

    render() {
        const { Header, Loading, Message, Icon, Modal } = Stage.Basic;
        if (this.state.graphResult !== null) {
            const height = this.state.graphResult.height + 2 * GRAPH_VERTICAL_MARGIN;
            return (
                <div ref={this.wrapper} style={{ position: 'relative' }}>
                    {this.renderGraph(this.state.containerWidth, Math.min(MAX_GRAPH_HEIGHT, height))}
                    <Icon
                        name="expand"
                        link
                        style={{
                            position: 'absolute',
                            top: 1,
                            right: -2,
                            background: 'white',
                            opacity: 1,
                            display: 'inline-table',
                            padding: '0 2px'
                        }}
                        onClick={() => this.setState({ maximized: true })}
                    />
                    <Modal
                        open={this.state.maximized}
                        onClose={() => this.setState({ maximized: false })}
                        size="fullscreen"
                    >
                        <div ref={this.modal}>{this.renderGraph(this.state.modalWidth, height)}</div>
                    </Modal>
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
