/**
 * Created by barucoh on 23/1/2019.
 */
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import GraphNodes from './GraphNodes';
import GraphEdges from './GraphEdges';

const POLLING_INTERVAL = 5000;
const MAX_GRAPH_HEIGHT = 380;
const GRAPH_MARGIN = 25;

const AUTO_FOCUS_ANIMATION_FRAMES = 30;
const AUTO_FOCUS_ANIMATION_FRAME_DURATION = 15;

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
            modalWidth: 0,
            position: {},
            modalPosition: {}
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
                    if (this.state.autoFocus) {
                        this.scrollToInProgress();
                    }
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

    scrollTo(x, y, frame = 1) {
        const { maximized, modalPosition, position } = this.state;
        const currentPosition = maximized ? modalPosition : position;
        const positionToFocusOn = {
            // See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#Matrix
            e: currentPosition.e - ((currentPosition.e - x) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            f: currentPosition.f - ((currentPosition.f - y) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            a: currentPosition.a - ((currentPosition.a - 1) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            d: currentPosition.d - ((currentPosition.d - 1) * frame) / AUTO_FOCUS_ANIMATION_FRAMES
        };
        this.setState({
            [maximized ? 'modalPosition' : 'position']: { ...currentPosition, ...positionToFocusOn }
        });
        if (frame !== AUTO_FOCUS_ANIMATION_FRAMES && this.state.autoFocus)
            setTimeout(() => this.scrollTo(x, y, frame + 1), AUTO_FOCUS_ANIMATION_FRAME_DURATION);
    }

    scrollToInProgress() {
        const focusNode = _.find(this.state.graphResult.children, containerNode =>
            _.find(containerNode.children, subGraphNode =>
                _.includes(['Started', 'Sent', 'Rescheduled'], subGraphNode.labels[0].state)
            )
        );
        if (focusNode) {
            this.scrollTo(-focusNode.x + GRAPH_MARGIN, -focusNode.y + GRAPH_MARGIN);
        }
    }

    renderGraph(width, height, positionStateProp, openInModalIcon) {
        const { Icon } = Stage.Basic;
        return (
            <>
                <div
                    style={{
                        position: 'absolute',
                        top: 1,
                        right: 2,
                        background: 'white',
                        opacity: 1,
                        display: 'inline-table',
                        zIndex: 1
                    }}
                >
                    <Icon
                        name="play"
                        link
                        color={this.state.autoFocus ? 'green' : null}
                        style={{
                            padding: '0 2px',
                            marginRight: 0
                        }}
                        onClick={() => this.setState({ autoFocus: true }, this.scrollToInProgress)}
                        title="Focus on tasks in progress"
                    />
                    {openInModalIcon && (
                        <Icon
                            name="expand"
                            link
                            style={{
                                marginRight: 0
                            }}
                            onClick={() => this.setState({ maximized: true })}
                            title="Open in window"
                        />
                    )}
                </div>
                <ReactSVGPanZoom
                    width={width}
                    height={height}
                    background="#fff"
                    tool="pan"
                    miniatureProps={{ position: 'none' }}
                    toolbarProps={{ position: 'none' }}
                    value={this.state[positionStateProp]}
                    onChangeValue={position =>
                        this.setState({
                            [positionStateProp]: _.isEmpty(this.state[positionStateProp])
                                ? { ...position, f: GRAPH_MARGIN }
                                : position
                        })
                    }
                    onZoom={() => this.setState({ autoFocus: false })}
                    onPan={() => this.setState({ autoFocus: false })}
                    onChangeTool={_.noop}
                >
                    <svg width={this.state.graphResult.width} height={this.state.graphResult.height}>
                        <GraphNodes graphNodes={this.state.graphResult.children} />
                        <GraphEdges graphEdges={this.state.graphResult.edges} />
                    </svg>
                </ReactSVGPanZoom>
            </>
        );
    }

    render() {
        const { Loading, Message, Modal } = Stage.Basic;
        if (this.state.graphResult !== null) {
            const height = this.state.graphResult.height + 2 * GRAPH_MARGIN + 8;
            return (
                <div ref={this.wrapper} style={{ position: 'relative' }}>
                    {this.renderGraph(
                        Math.max(0, this.state.containerWidth - 1),
                        Math.min(MAX_GRAPH_HEIGHT, height),
                        'position',
                        true
                    )}
                    <Modal
                        open={this.state.maximized}
                        onClose={() => this.setState({ maximized: false })}
                        size="fullscreen"
                    >
                        <div ref={this.modal}>{this.renderGraph(this.state.modalWidth, height, 'modalPosition')}</div>
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
