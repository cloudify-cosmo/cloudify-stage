export default function ExecutionProgress({ execution: executionProp, instancesCount, instancesStates }) {
    const { Progress } = Stage.Basic;
    const {
        NodeInstancesConsts: { groupNames }
    } = Stage.Common;
    const { Execution } = Stage.Utils;

    const execution = { workflow_id: '', status: '', ...executionProp };
    const color = Execution.isActiveExecution(execution) ? 'yellow' : 'green';
    const error = Execution.isFailedExecution(execution);

    let ratio = 1;
    const { workflow_id: workflowId } = execution;
    if (workflowId === 'install') {
        ratio = _.get(instancesStates, groupNames.started, 0) / instancesCount;
    } else if (workflowId === 'uninstall') {
        ratio = _.get(instancesStates, groupNames.deleted, 0) / instancesCount;
    }
    const percent = parseInt(100 * ratio, 10);

    return <Progress percent={percent} error={error} attached="bottom" color={color} />;
}

ExecutionProgress.propTypes = {
    execution: PropTypes.shape({
        status: PropTypes.string,
        workflow_id: PropTypes.string,
        error: PropTypes.string
    }).isRequired,
    instancesCount: PropTypes.number.isRequired,
    instancesStates: PropTypes.shape({
        started: PropTypes.number,
        deleted: PropTypes.number
    }).isRequired
};
