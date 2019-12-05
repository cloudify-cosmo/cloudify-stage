export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    getClusterStatus(managerId, onStart, onSuccess, onError, onEnd = () => {}) {
        onStart(managerId);
        return this.toolbox
            .getWidgetBackend()
            .doGet('get_cluster_status', { deploymentId: managerId })
            .then(result => {
                onEnd();
                return onSuccess(managerId, result);
            })
            .catch(error => {
                onEnd();
                return onError(managerId, error.message);
            });
    }
}
