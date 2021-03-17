interface ExecutionProgressProps {
    execution: {
        status: string;
        /* eslint-disable camelcase */
        finished_operations: number;
        total_operations: number;
        /* eslint-enable camelcase */
    };
}

const ExecutionProgress: React.FunctionComponent<ExecutionProgressProps> = ({ execution }) => {
    const { Progress } = Stage.Basic;
    const { Execution } = Stage.Utils;

    const color = Execution.isActiveExecution(execution) ? 'yellow' : 'green';
    const error = Execution.isFailedExecution(execution);

    const { finished_operations: finishedOperations, total_operations: totalOperations } = execution;
    const ratio = finishedOperations / totalOperations;
    const percent = Number.isFinite(ratio) ? Math.round(ratio * 100) : 0;

    return <Progress percent={percent} error={error} attached="bottom" color={color} />;
};
export default ExecutionProgress;

ExecutionProgress.propTypes = {
    execution: PropTypes.shape({
        status: PropTypes.string.isRequired,
        finished_operations: PropTypes.number.isRequired,
        total_operations: PropTypes.number.isRequired
    }).isRequired
};
