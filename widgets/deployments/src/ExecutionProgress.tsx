// NOTE: the file contains only types and is undetectable for ESLint
// eslint-disable-next-line import/no-unresolved
import type { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

interface ExecutionProgressProps {
    execution: {
        status?: string;
        /* eslint-disable camelcase */
        finished_operations?: number;
        total_operations?: number;
        /* eslint-enable camelcase */
    };
}

const ExecutionProgress: React.FunctionComponent<ExecutionProgressProps> = ({ execution }) => {
    const { Progress } = Stage.Basic;
    const { Execution } = Stage.Utils;

    const color: SemanticCOLORS = Execution.isActiveExecution(execution) ? 'yellow' : 'green';
    const error: boolean = Execution.isFailedExecution(execution);
    const progress: number = Execution.getProgress(execution);

    return <Progress percent={progress} error={error} attached="bottom" color={color} />;
};
export default ExecutionProgress;
