import React, { useEffect, useRef, useState } from 'react';
import ExecutionWorkflowGraph from './tasksGraph/ExecutionWorkflowGraph';

export default function SingleExecution({ execution, toolbox }) {
    const container = useRef();
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

SingleExecution.propTypes = {
    execution: PropTypes.shape({}).isRequired,
    toolbox: PropTypes.shape({
        getEventBus: PropTypes.func,
        refresh: PropTypes.func
    }).isRequired
};
