/**
 * Created by kinneretzin on 19/10/2016.
 */


export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(blueprint) {
        return this.toolbox.getManager().doDelete(`/deployments/${blueprint.id}`);
    }

    doExecute(deployment,workflow,params) {
        return this.toolbox.getManager().doPost('/executions',null,{
            'deployment_id': deployment.id,
            'workflow_id' : workflow.name,
            parameters: params
        });
    }

}