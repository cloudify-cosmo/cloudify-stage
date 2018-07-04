/**
 * Created by jakubniezgoda on 04/07/2018.
 */

class DeploymentUtils {
    static filterWorkflows(workflows) {
        const UPDATE_WORKFLOW = 'update';
        return _.filter(workflows, (workflow) => !_.isEqual(workflow.name, UPDATE_WORKFLOW));
    }
}

Stage.defineCommon({
    name: 'DeploymentUtils',
    common: DeploymentUtils
});