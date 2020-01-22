export default class ExecutionsService {
    static isRunning(execution) {
        if (!execution) {
            return false;
        }
        if (Array.isArray(execution)) {
            // handle list
            return !!_.find(execution, ExecutionsService.isRunning);
        }
        return ['failed', 'terminated', 'cancelled'].indexOf(execution.status) < 0;
    }
}
