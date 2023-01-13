import React, { useEffect, useRef, useState } from 'react';
import type { Execution } from 'app/utils/shared/ExecutionUtils';
import type { Toolbox } from 'app/utils/StageAPI';
import ExecutionWorkflowGraph from './tasksGraph/ExecutionWorkflowGraph';

export default function SingleExecution({ execution, toolbox }: { execution: Execution; toolbox: Toolbox }) {
    const container = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const { useRefreshEvent } = Stage.Hooks;

    useRefreshEvent(toolbox, 'executions:refresh');

    useEffect(() => {
        const newContainerHeight = _.get(container.current, 'offsetHeight');
        if (newContainerHeight && newContainerHeight !== containerHeight) {
            setContainerHeight(newContainerHeight);
        }
    });

    return (
        <div ref={container} style={{ height: '100%' }}>
            <ExecutionWorkflowGraph
                selectedExecution={execution}
                toolbox={toolbox}
                containerHeight={containerHeight}
                showStatus
            />
        </div>
    );
}
