import React, { useEffect, useRef, useState } from 'react';
import ExecutionWorkflowGraph from './tasksGraph/ExecutionWorkflowGraph';

export default function SingleExecution({ execution, toolbox }) {
    const container = useRef();
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        const newContainerHeight = _.get(container.current, 'offsetHeight');
        if (newContainerHeight && newContainerHeight !== containerHeight) {
            setContainerHeight(newContainerHeight);
        }
        toolbox.getEventBus().on('executions:refresh', toolbox.refresh, this);

        return function cleanup() {
            toolbox.getEventBus().off('executions:refresh', toolbox.refresh);
        };
    });

    return (
        <div ref={container} style={{ height: '100%' }}>
            <ExecutionWorkflowGraph selectedExecution={execution} toolbox={toolbox} containerHeight={containerHeight} />
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
