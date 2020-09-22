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

export default function ExecutionWorkflowGraph({ containerHeight, selectedExecution, showStatus, toolbox }) {
    const { useState, useRef, useEffect } = React;
    const { useBoolean } = Stage.Hooks;

    const [graphResult, setGraphResult] = useState(null);
    const [error, setError] = useState('');
    const [isMaximized, maximize, minimize] = useBoolean();
    const [position, setPosition] = useState({});
    const [modalPosition, setModalPosition] = useState({});
    const [autoFocus, setAutoFocus] = useState();

    const timer = useRef(null);
    const cancelablePromise = useRef(null);
    const wrapper = useRef();
    const modal = useRef();

    function stopPolling() {
        clearTimeout(timer.current);
        timer.current = null;
        if (cancelablePromise.current) cancelablePromise.current.cancel();
    }

    function getTasksGraphPromise() {
        const tasksGraphParams = {
            execution_id: selectedExecution.id,
            name: selectedExecution.workflow_id
        };
        return toolbox.getWidgetBackend().doGet('get_tasks_graph', { ...tasksGraphParams });
    }

    function startPolling() {
        const fetchTasksGraph = () => {
            cancelablePromise.current = Stage.Utils.makeCancelable(getTasksGraphPromise());
            cancelablePromise.current.promise
                .then(tasksGraph => {
                    if (graphResult !== tasksGraph) {
                        setGraphResult(tasksGraph);
                        setError('');
                    }
                })
                .catch(({ message, status }) => {
                    setGraphResult(null);
                    setError(status === 404 ? NO_TASKS_GRAPH_MESSAGE : message);
                });

            const { isActiveExecution } = Stage.Utils.Execution;
            timer.current = setTimeout(
                fetchTasksGraph,
                isActiveExecution(selectedExecution)
                    ? ACTIVE_EXECUTION_POLLING_INTERVAL
                    : INACTIVE_EXECUTION_POLLING_INTERVAL
            );

            return cancelablePromise.current.promise;
        };

        stopPolling();
        return fetchTasksGraph();
    }

    useEffect(() => {
        if (timer.current) {
            setGraphResult(null);
            setError('');
            startPolling();
        }
    }, [selectedExecution.id]);

    function scrollTo(x, y, zoom = 1, autoFocusOnly = true, frame = 1) {
        const currentPosition = isMaximized ? modalPosition : position;
        const positionToFocusOn = {
            // See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#Matrix
            e: currentPosition.e - ((currentPosition.e - x) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            f: currentPosition.f - ((currentPosition.f - y) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            a: currentPosition.a - ((currentPosition.a - zoom) * frame) / AUTO_FOCUS_ANIMATION_FRAMES,
            d: currentPosition.d - ((currentPosition.d - zoom) * frame) / AUTO_FOCUS_ANIMATION_FRAMES
        };
        (isMaximized ? setModalPosition : setPosition)({ ...currentPosition, ...positionToFocusOn });
        if (frame !== AUTO_FOCUS_ANIMATION_FRAMES && (autoFocus || !autoFocusOnly))
            setTimeout(() => scrollTo(x, y, zoom, autoFocusOnly, frame + 1), AUTO_FOCUS_ANIMATION_FRAME_DURATION);
    }

    function getContainerWidth() {
        return _.get(wrapper.current, 'offsetWidth', 0);
    }

    function getModalWidth() {
        return _.get(modal.current, 'offsetWidth', 0);
    }

    function fitToView() {
        const width = isMaximized ? getModalWidth() : Math.max(0, getContainerWidth() - 1);
        const height = isMaximized
            ? Math.max(MIN_MODAL_GRAPH_HEIGHT, graphResult.height + 2 * GRAPH_MARGIN)
            : containerHeight;
        const zoom = Math.min(
            (width - 2 * GRAPH_MARGIN) / graphResult.width,
            (height - 2 * GRAPH_MARGIN) / graphResult.height
        );

        scrollTo(GRAPH_MARGIN, GRAPH_MARGIN, zoom, false);
    }

    useEffect(() => {
        startPolling().then(() => {
            if (graphResult) {
                fitToView();
            }
        });
        return stopPolling;
    }, []);

    function scrollToInProgress() {
        const focusNode = _.find(graphResult.children, containerNode =>
            _.find(containerNode.children, subGraphNode => _.includes(states.inProgress, subGraphNode.labels[0].state))
        );
        if (focusNode) {
            scrollTo(-focusNode.x + GRAPH_MARGIN, -focusNode.y + GRAPH_MARGIN);
        }
    }

    useEffect(() => {
        if (graphResult && autoFocus) {
            scrollToInProgress();
        }
    }, [graphResult, autoFocus]);

    function actOnExecution(execution, action, executionError) {
        setError(executionError);
    }

    function renderGraph(width, height, positionValue, positionSetter, openInModalIcon = true, minimap) {
        const { Icon } = Stage.Basic;
        const { LastExecutionStatusIcon } = Stage.Common;
        return (
            <>
                {showStatus && !minimap && (
                    <div style={{ position: 'absolute', top: 2, left: 2, zIndex: 1, opacity: 1 }}>
                        <LastExecutionStatusIcon
                            execution={selectedExecution}
                            onActOnExecution={actOnExecution}
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
                        onClick={() => setAutoFocus(!autoFocus)}
                        title="Focus on tasks in progress"
                    />
                    <Icon
                        name="expand arrows alternate"
                        link
                        onClick={() => {
                            setAutoFocus(false);
                            fitToView();
                        }}
                        title="Fit to view"
                    />
                    {openInModalIcon ? (
                        <Icon name="expand" link onClick={maximize} title="Open in window" />
                    ) : (
                        <Icon
                            name="close"
                            link
                            onClick={minimize}
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
                    value={positionValue}
                    onChangeValue={newPosition =>
                        positionSetter(_.isEmpty(positionValue) ? { ...newPosition, f: GRAPH_MARGIN } : newPosition)
                    }
                    onZoom={() => setAutoFocus(false)}
                    onPan={() => setAutoFocus(false)}
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

    const { Loading, Message, Modal } = Stage.Basic;
    const { LastExecutionStatusIcon } = Stage.Common;

    return (
        <div>
            {showStatus && !graphResult && (
                <LastExecutionStatusIcon
                    execution={selectedExecution}
                    onActOnExecution={actOnExecution}
                    showLabel
                    labelAttached={false}
                    toolbox={toolbox}
                />
            )}

            {error && <Message error={error !== NO_TASKS_GRAPH_MESSAGE}>{error}</Message>}

            {graphResult && (
                <div ref={wrapper} style={{ position: 'relative' }}>
                    {renderGraph(Math.max(0, getContainerWidth() - 1), containerHeight, position, setPosition)}
                    <Modal open={isMaximized} onClose={minimize} size="fullscreen">
                        <div ref={modal}>
                            {renderGraph(
                                getModalWidth(),
                                Math.max(MIN_MODAL_GRAPH_HEIGHT, graphResult.height + 2 * GRAPH_MARGIN),
                                modalPosition,
                                setModalPosition,
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

ExecutionWorkflowGraph.propTypes = {
    selectedExecution: PropTypes.shape({ id: PropTypes.string, workflow_id: PropTypes.string }).isRequired,
    containerHeight: PropTypes.number.isRequired,
    showStatus: PropTypes.bool,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

ExecutionWorkflowGraph.defaultProps = {
    showStatus: false
};
