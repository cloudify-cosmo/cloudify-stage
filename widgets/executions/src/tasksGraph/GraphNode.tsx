import type { Toolbox } from 'app/utils/StageAPI';
import { findKey, includes, isEmpty, size } from 'lodash';
import type { ExecutionGraphNode } from 'backend/handler/ExecutionsHandler.types';
import states from './States';

const textHeight = 18;
const rx = 3;
const stateBarHeight = 5;

const colors = {
    inProgress: 'rgb(215,227,45)',
    succeeded: 'rgb(3,191,0)',
    failed: 'rgb(249, 25, 25)'
};

const translate = Stage.Utils.getT('widgets.executions.graph');

const GraphNode = ({ graphNode, toolbox }: { graphNode: ExecutionGraphNode; toolbox: Toolbox }) => {
    const labels = graphNode.labels[0];
    const { Icon } = Stage.Basic;

    let currentTextPlacementY = 0;

    const title = labels.displayTitle || [labels.text];
    const { displayText, state } = labels;
    const mappedState = findKey(states, stateArray => includes(stateArray, state)) as keyof typeof states;
    const stateColor = colors[mappedState];

    const headerHeight = size(title) * textHeight + textHeight / 2;
    const { nodeInstanceId, operation } = graphNode;
    const showLogsIcon =
        displayText && nodeInstanceId && operation && (state !== 'Pending' || (labels.retry && labels.retry > 0));
    return (
        <g className="g-tasks-graph-general">
            {stateColor && (
                <>
                    <rect
                        height={stateBarHeight * 3}
                        width={graphNode.width}
                        rx={rx}
                        stroke={stateColor}
                        style={{ fill: stateColor }}
                        transform={`translate(0, -${stateBarHeight})`}
                    />
                    <rect
                        transform={`translate(0.5, ${headerHeight})`}
                        height={graphNode.height! - headerHeight}
                        width={graphNode.width! - 1}
                        strokeWidth={0}
                        style={{ fill: stateColor }}
                        opacity={0.5}
                    />
                </>
            )}
            <rect
                transform="translate(0.5, 0.5)"
                height={headerHeight}
                width={graphNode.width! - 1}
                strokeWidth={0}
                style={{ fill: !isEmpty(graphNode.children) ? '#F2F2F2' : 'white' }}
            />
            <rect height={graphNode.height} width={graphNode.width} rx={rx} fillOpacity={0} />
            <path d={`m 0,${headerHeight} h ${graphNode.width} z`} strokeWidth={0.5} />
            {title !== null &&
                // eslint-disable-next-line no-return-assign
                title.map(line => (
                    <text
                        key={currentTextPlacementY}
                        className="text-tasks-graph-subgraph-title"
                        transform={
                            graphNode.children.length === 0 // Placing text according to subgraph tier
                                ? `translate(10, ${(currentTextPlacementY += textHeight)})`
                                : 'translate(12, 18)'
                        }
                    >
                        {line}
                    </text>
                ))}
            &gt;
            {showLogsIcon && (
                <foreignObject
                    width={textHeight}
                    height={textHeight * 2}
                    x={graphNode.width! - textHeight - 3}
                    y={headerHeight + 3}
                >
                    <Icon
                        name="file alternate outline"
                        // NOTE: `display: inline` to fix a rendering bug in webkit
                        style={{ fontSize: '1.3em', cursor: 'pointer', display: 'inline' }}
                        title={translate('showLogs')}
                        onClick={() => {
                            const context = toolbox.getContext();
                            const eventBus = toolbox.getEventBus();

                            context.setValue('nodeInstanceId', nodeInstanceId);
                            eventBus.trigger('filter:refresh');

                            const eventFilter = 'eventFilter';
                            context.setValue(eventFilter, {
                                ...context.getValue(eventFilter),
                                operationText: operation
                            });
                            eventBus.trigger('eventsFilter:refresh');
                        }}
                    />
                </foreignObject>
            )}
            {displayText &&
                // eslint-disable-next-line no-return-assign
                displayText.map(line => (
                    <text
                        key={currentTextPlacementY}
                        className="text-tasks-graph-operation-and-state"
                        transform={`translate(10, ${(currentTextPlacementY += textHeight) + 7})`}
                    >
                        {line}
                    </text>
                ))}
        </g>
    );
};

export default GraphNode;
