import type { OptionalProps, Value } from 'react-svg-pan-zoom';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import type { Execution } from 'app/utils/shared/ExecutionUtils';
import type { Toolbox } from 'app/utils/StageAPI';
import type { LatestExecutionStatusIconProps } from 'app/widgets/common/executions/LatestExecutionStatusIcon';
import type { ElkNode } from 'elkjs';
import type { CancelablePromise } from 'app/utils/types';
import GraphEdges from './GraphEdges';
import GraphNodes from './GraphNodes';
import states from './States';

const INACTIVE_EXECUTION_POLLING_INTERVAL = 5000;
const ACTIVE_EXECUTION_POLLING_INTERVAL = 2500;

const MIN_MODAL_GRAPH_HEIGHT = 300;
const GRAPH_MARGIN = 25;

const AUTO_FOCUS_ANIMATION_FRAMES = 30;
const AUTO_FOCUS_ANIMATION_FRAME_DURATION = 10;

const NO_TASKS_GRAPH_MESSAGE = 'The selected execution does not have a tasks graph';

const INITIAL_POSITION = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: GRAPH_MARGIN,
    version: 3
} as unknown as Value;

export default function ExecutionWorkflowGraph({
    containerHeight,
    selectedExecution,
    showStatus,
    toolbox
}: {
    containerHeight: number;
    selectedExecution: Execution;
    showStatus?: boolean;
    toolbox: Toolbox;
}) {
    const { useState, useRef, useEffect, useCallback } = React;
    const { useBoolean, useResettableState, useWidthObserver } = Stage.Hooks;

    const [graphData, setGraphData, clearGraphData] = useResettableState<ElkNode | null>(null);
    const [error, setError, clearError] = useResettableState('');
    const [isMaximized, maximize, minimize] = useBoolean();
    const [position, setPosition] = useState(INITIAL_POSITION);
    const [modalPosition, setModalPosition] = useState(INITIAL_POSITION);
    const [autoFocus, setAutoFocus] = useState<boolean>();

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelablePromise = useRef<CancelablePromise<ElkNode> | null>(null);
    const modal = useRef<HTMLDivElement | null>(null);

    const [wrapperRef, getWrapperWidth] = useWidthObserver();

    function stopPolling() {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = null;
        if (cancelablePromise.current) cancelablePromise.current.cancel();
    }

    function getTasksGraphPromise() {
        const params = {
            execution_id: selectedExecution.id
        };
        return toolbox.getWidgetBackend().doGet<ElkNode>('get_tasks_graph', { params });
    }

    function startPolling() {
        const fetchTasksGraph = () => {
            cancelablePromise.current = Stage.Utils.makeCancelable(getTasksGraphPromise());
            cancelablePromise.current.promise
                .then(tasksGraph => {
                    setGraphData(tasksGraph);
                    clearError();
                })
                .catch(({ message, status, isCanceled }) => {
                    if (isCanceled) {
                        return;
                    }

                    clearGraphData();
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

        return fetchTasksGraph();
    }

    useEffect(() => {
        clearGraphData();
        clearError();
        startPolling();
        return stopPolling;
    }, [selectedExecution.id]);

    function scrollTo(x: number, y: number, zoom = 1, autoFocusOnly = true, frame = 1) {
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

    function getModalWidth() {
        return _.get(modal.current, 'offsetWidth', 0);
    }

    function fitToView() {
        const { width: graphWidth, height: graphHeight } = graphData!;
        const width = isMaximized ? getModalWidth() : getWrapperWidth();
        const height = isMaximized
            ? Math.max(MIN_MODAL_GRAPH_HEIGHT, graphHeight! + 2 * GRAPH_MARGIN)
            : containerHeight;
        const zoom = Math.min((width - 2 * GRAPH_MARGIN) / graphWidth!, (height - 2 * GRAPH_MARGIN) / graphHeight!);

        scrollTo(GRAPH_MARGIN, GRAPH_MARGIN, zoom, false);
    }

    useEffect(() => {
        if (graphData) fitToView();
    }, [!!graphData]);

    function scrollToInProgress() {
        const focusNode = graphData?.children?.find(containerNode =>
            _.find(containerNode.children, subGraphNode =>
                _.includes(states.inProgress, subGraphNode.labels?.[0].state)
            )
        );
        if (focusNode) {
            scrollTo(-focusNode.x! + GRAPH_MARGIN, -focusNode.y! + GRAPH_MARGIN);
        }
    }

    useEffect(() => {
        if (graphData && autoFocus) {
            scrollToInProgress();
        }
    }, [graphData, autoFocus]);

    const actOnExecution = useCallback<NonNullable<LatestExecutionStatusIconProps['onActOnExecution']>>(
        (_execution, _action, executionError) => setError(executionError),
        []
    );

    function renderGraph(
        width: number,
        height: number,
        positionValue: Value,
        positionSetter: (value: Value) => void,
        openInModalIcon = true,
        minimap = false
    ) {
        const { Icon } = Stage.Basic;
        const { LatestExecutionStatusIcon } = Stage.Common.Executions;
        return (
            <>
                {showStatus && !minimap && (
                    <div style={{ position: 'absolute', top: 2, left: 2, zIndex: 1, opacity: 1 }}>
                        <LatestExecutionStatusIcon
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
                        color={autoFocus ? 'green' : undefined}
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
                    miniatureProps={minimap ? undefined : ({ position: 'none' } as OptionalProps['miniatureProps'])}
                    toolbarProps={{ position: 'none' }}
                    value={{ ...positionValue, viewerWidth: width, viewerHeight: height }}
                    onChangeValue={positionSetter}
                    onZoom={() => setAutoFocus(false)}
                    onPan={() => setAutoFocus(false)}
                    onChangeTool={_.noop}
                >
                    <svg width={graphData?.width} height={graphData?.height}>
                        <GraphNodes graphNodes={graphData?.children ?? []} toolbox={toolbox} />
                        <GraphEdges graphEdges={graphData?.edges ?? []} />
                    </svg>
                </ReactSVGPanZoom>
            </>
        );
    }

    const { Loading, Message, Modal } = Stage.Basic;
    const { LatestExecutionStatusIcon } = Stage.Common.Executions;

    return (
        <div>
            {showStatus && !graphData && (
                <LatestExecutionStatusIcon
                    execution={selectedExecution}
                    onActOnExecution={actOnExecution}
                    showLabel
                    labelAttached={false}
                    toolbox={toolbox}
                />
            )}

            {error && <Message error={error !== NO_TASKS_GRAPH_MESSAGE}>{error}</Message>}

            {graphData && (
                <div ref={wrapperRef} style={{ position: 'relative' }}>
                    {renderGraph(getWrapperWidth(), containerHeight, position, setPosition)}
                    <Modal open={isMaximized} onClose={minimize} size="fullscreen">
                        <div ref={modal}>
                            {renderGraph(
                                getModalWidth(),
                                Math.max(MIN_MODAL_GRAPH_HEIGHT, graphData.height! + 2 * GRAPH_MARGIN),
                                modalPosition,
                                setModalPosition,
                                false,
                                true
                            )}
                        </div>
                    </Modal>
                </div>
            )}

            {!graphData && !error && (
                <div style={{ height: 200 }}>
                    <Loading />
                </div>
            )}
        </div>
    );
}
