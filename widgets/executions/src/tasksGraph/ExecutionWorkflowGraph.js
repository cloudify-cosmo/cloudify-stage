/**
 * Created by barucoh on 23/1/2019.
 */
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import GraphEdges from './GraphEdges';
import GraphNodes from './GraphNodes';
import states from './States';

const INACTIVE_EXECUTION_POLLING_INTERVAL = 5000;
const ACTIVE_EXECUTION_POLLING_INTERVAL = 2500;

const MIN_MODAL_GRAPH_HEIGHT = 300;
const GRAPH_MARGIN = 25;

const AUTO_FOCUS_ANIMATION_FRAMES = 30;
const AUTO_FOCUS_ANIMATION_FRAME_DURATION = 15;

const NO_TASKS_GRAPH_MESSAGE = 'The selected execution does not have a tasks graph';

export default class ExecutionWorkflowGraph extends React.Component {
    static propTypes = {
        selectedExecution: PropTypes.shape({ id: PropTypes.string, workflow_id: PropTypes.string }).isRequired,
        containerHeight: PropTypes.number.isRequired,
        showStatus: PropTypes.bool,
        toolbox: Stage.PropTypes.Toolbox.isRequired
    };

    static defaultProps = {
        showStatus: false
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            graphResult: null,
            error: '',
            maximized: false,
            containerWidth: 0,
            modalWidth: 0,
            position: {},
            modalPosition: {}
        };
        this.timer = null;
        this.cancelablePromise = null;
        this.actOnExecution = this.actOnExecution.bind(this);
        this.startPolling = this.startPolling.bind(this); // Required for the setTimeout function which changes the scope for 'this'
        this.stopPolling = this.stopPolling.bind(this);
        this.wrapper = React.createRef();
        this.modal = React.createRef();
    }

    componentDidMount() {
        this.startPolling();
    }

    componentDidUpdate(prevProps) {
        const { containerWidth: stateContainerWidth, modalWidth: stateModalWidth } = this.state;
        const newState = {};

        const containerWidth = _.get(this.wrapper.current, 'offsetWidth');
        if (containerWidth && containerWidth !== stateContainerWidth) {
            newState.containerWidth = containerWidth;
        }

        const modalWidth = _.get(this.modal.current, 'offsetWidth');
        if (modalWidth && modalWidth !== stateModalWidth) {
            newState.modalWidth = modalWidth;
        }

        const { selectedExecution } = this.props;
        const { id: newExecutionId } = selectedExecution;
        const { id: oldExecutionId } = prevProps.selectedExecution;
        if (newExecutionId !== oldExecutionId) {
            newState.graphResult = null;
            newState.error = '';
        }

        if (!_.isEmpty(newState)) {
            this.setState(newState, () => this.startPolling());
        }
    }

    componentWillUnmount() {
        this.stopPolling();
    }

    actOnExecution(execution, action, error) {
        this.setState({ error });
    }

    startPolling() {
        const fetchTasksGraph = () => {
            this.cancelablePromise = Stage.Utils.makeCancelable(this.getTasksGraphPromise());
            this.cancelablePromise.promise
                .then(tasksGraph => {
                    const { autoFocus, graphResult } = this.state;
                    if (graphResult !== tasksGraph) {
                        this.setState({
                            graphResult: tasksGraph,
                            error: ''
                        });
                        if (autoFocus) {
                            this.scrollToInProgress();
                        }
                    }
                })
                .catch(error => {
                    const { message } = error;
                    this.setState({
                        graphResult: null,
                        error: error.status === 404 ? NO_TASKS_GRAPH_MESSAGE : message
                    });
                });

            const { selectedExecution } = this.props;
            const { isActiveExecution } = Stage.Utils.Execution;
            this.timer = setTimeout(
                fetchTasksGraph,
                isActiveExecution(selectedExecution)
                    ? ACTIVE_EXECUTION_POLLING_INTERVAL
                    : INACTIVE_EXECUTION_POLLING_INTERVAL
            );
        };

        this.stopPolling();
        fetchTasksGraph();
    }

    stopPolling() {
        clearTimeout(this.timer);
        this.timer = null;
        if (this.cancelablePromise) this.cancelablePromise.cancel();
    }

    getTasksGraphPromise() {
        const { selectedExecution, toolbox } = this.props;
        const tasksGraphParams = {
            execution_id: selectedExecution.id,
            name: selectedExecution.workflow_id
        };
        return toolbox.getWidgetBackend().doGet('get_tasks_graph', { ...tasksGraphParams });
    }

    scrollTo(x, y, zoom = 1, autoFocusOnly = true, frame = 1) {
        const { maximized, modalPosition, position, autoFocus } = this.state;
        const currentPosition = maximized ? modalPosition : position;
        const positionToFocusOn = {
            // See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#Matrix
            e: currentPosition.e - ((currentPosition.e - x) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            f: currentPosition.f - ((currentPosition.f - y) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            a: currentPosition.a - ((currentPosition.a - zoom) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            d: currentPosition.d - ((currentPosition.d - zoom) * frame) / AUTO_FOCUS_ANIMATION_FRAMES
        };
        this.setState({
            [maximized ? 'modalPosition' : 'position']: { ...currentPosition, ...positionToFocusOn }
        });
        if (frame !== AUTO_FOCUS_ANIMATION_FRAMES && (autoFocus || !autoFocusOnly))
            setTimeout(() => this.scrollTo(x, y, zoom, autoFocusOnly, frame + 1), AUTO_FOCUS_ANIMATION_FRAME_DURATION);
    }

    scrollToInProgress() {
        const { graphResult } = this.state;
        const focusNode = _.find(graphResult.children, containerNode =>
            _.find(containerNode.children, subGraphNode => _.includes(states.inProgress, subGraphNode.labels[0].state))
        );
        if (focusNode) {
            this.scrollTo(-focusNode.x + GRAPH_MARGIN, -focusNode.y + GRAPH_MARGIN);
        }
    }

    renderGraph(width, height, positionStateProp, openInModalIcon = true, minimap) {
        const { selectedExecution, showStatus, toolbox } = this.props;
        const { state } = this;
        const { autoFocus, graphResult } = state;
        const { Icon } = Stage.Basic;
        const { LastExecutionStatusIcon } = Stage.Common;
        return (
            <>
                {showStatus && !minimap && (
                    <div style={{ position: 'absolute', top: 2, left: 2, zIndex: 1, opacity: 1 }}>
                        <LastExecutionStatusIcon
                            execution={selectedExecution}
                            onActOnExecution={this.actOnExecution}
                            showLabel
                            labelAttached={false}
                            toolbox={toolbox}
                        />
                    </div>
                )}
                <div className="executions-graph-toolbar">
                    <Icon
                        name="play"
                        link
                        color={autoFocus ? 'green' : null}
                        onClick={() => this.setState({ autoFocus: !autoFocus }, this.scrollToInProgress)}
                        title="Focus on tasks in progress"
                    />
                    <Icon
                        name="expand arrows alternate"
                        link
                        onClick={() =>
                            this.scrollTo(
                                GRAPH_MARGIN / 2,
                                GRAPH_MARGIN,
                                Math.min(
                                    width / (graphResult.width + GRAPH_MARGIN),
                                    height / (graphResult.height + GRAPH_MARGIN)
                                ),
                                false
                            )
                        }
                        title="Fit to view"
                    />
                    {openInModalIcon ? (
                        <Icon
                            name="expand"
                            link
                            onClick={() => this.setState({ maximized: true })}
                            title="Open in window"
                        />
                    ) : (
                        <Icon
                            name="close"
                            link
                            onClick={() => this.setState({ maximized: false })}
                            style={{ fontSize: '1.25em', marginTop: -2 }}
                            title="Close window"
                        />
                    )}
                </div>
                <ReactSVGPanZoom
                    width={width}
                    height={height}
                    background="#fff"
                    tool="pan"
                    miniatureProps={minimap ? undefined : { position: 'none' }}
                    toolbarProps={{ position: 'none' }}
                    value={state[positionStateProp]}
                    onChangeValue={position =>
                        this.setState({
                            [positionStateProp]: _.isEmpty(state[positionStateProp])
                                ? { ...position, f: GRAPH_MARGIN }
                                : position
                        })
                    }
                    onZoom={() => this.setState({ autoFocus: false })}
                    onPan={() => this.setState({ autoFocus: false })}
                    onChangeTool={_.noop}
                >
                    <svg width={graphResult.width} height={graphResult.height}>
                        <GraphNodes graphNodes={graphResult.children} toolbox={toolbox} />
                        <GraphEdges graphEdges={graphResult.edges} />
                    </svg>
                </ReactSVGPanZoom>
            </>
        );
    }

    render() {
        const { containerHeight, selectedExecution, showStatus, toolbox } = this.props;
        const { containerWidth, error, graphResult, maximized, modalWidth } = this.state;
        const { Loading, Message, Modal } = Stage.Basic;
        const { containerHeight } = this.props;
        const { selectedExecution, showStatus, toolbox } = this.props;

        const { LastExecutionStatusIcon } = Stage.Common;

        return (
            <div>
                {showStatus && !graphResult && (
                    <LastExecutionStatusIcon
                        execution={selectedExecution}
                        onActOnExecution={this.actOnExecution}
                        showLabel
                        labelAttached={false}
                        toolbox={toolbox}
                    />
                )}

                {error && <Message error={error !== NO_TASKS_GRAPH_MESSAGE}>{error}</Message>}

                {graphResult && (
                    <div ref={this.wrapper} style={{ position: 'relative' }}>
                        {this.renderGraph(Math.max(0, containerWidth - 1), containerHeight, 'position')}
                        <Modal open={maximized} onClose={() => this.setState({ maximized: false })} size="fullscreen">
                            <div ref={this.modal}>
                                {this.renderGraph(
                                    modalWidth,
                                    Math.max(MIN_MODAL_GRAPH_HEIGHT, graphResult.height + 2 * GRAPH_MARGIN + 8),
                                    'modalPosition',
                                    false,
                                    true
                                )}
                            </div>
                        </Modal>
                    </div>
                )}

                {!graphResult && !error && (
                    <div style={{ height: 200 }}>
                        <Loading />
                    </div>
                )}
            </div>
        );
    }
}
