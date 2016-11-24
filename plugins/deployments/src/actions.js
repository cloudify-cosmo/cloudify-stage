/**
 * Created by kinneretzin on 19/10/2016.
 */


export default class {
    constructor(context) {
        this.context = context;
    }

    delete(deployment) {
        return this.context.doDelete(`/api/v2.1/deployments/${deployment.id}`);
    }

    update() {

    }

    execute(deployment,workflow,params) {
        return this.context.doPost('/api/v2.1/executions',
                {
                    'deployment_id': deployment.id,
                    'workflow_id' : workflow.name,
                    parameters: params
                }
        );
    }
}