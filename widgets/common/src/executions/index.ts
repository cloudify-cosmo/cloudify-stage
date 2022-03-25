import Actions from './ExecutionActions';
import LastExecutionStatusIcon from './LastExecutionStatusIcon';

const ExecutionsCommon = {
    Actions,
    LastExecutionStatusIcon
};

declare global {
    namespace Stage.Common {
        const Executions: typeof ExecutionsCommon;
    }
}

Stage.defineCommon({
    name: 'Executions',
    common: ExecutionsCommon
});
