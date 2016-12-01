/**
 * Created by kinneretzin on 19/10/2016.
 */


export default class {
    constructor(context) {
        this.context = context;
    }

    doDelete(blueprint) {
        return this.context.getManager().doDelete(`/deployments/${blueprint.id}`);
    }

    doExecute(deployment,workflow,params) {
        return this.context.getManager().doPost('/executions',null,{
            'deployment_id': deployment.id,
            'workflow_id' : workflow.name,
            parameters: params
        });
    }
}