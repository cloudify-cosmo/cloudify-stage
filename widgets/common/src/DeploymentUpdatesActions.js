/**
 * Created by jakubniezgoda on 10/05/2018.
 */

class DeploymentUpdatesActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetUpdate(id) {
        return this.toolbox.getManager().doGet(`/deployment-updates/${id}`);
    }
}

Stage.defineCommon({
    name: 'DeploymentUpdatesActions',
    common: DeploymentUpdatesActions
});