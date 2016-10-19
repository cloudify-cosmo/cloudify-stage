/**
 * Created by kinneretzin on 19/10/2016.
 */


export default class {
    constructor(context) {
        this.context = context;
    }

    delete(deployment) {
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: this.context.getManagerUrl() + '/api/v2.1/deployments/'+deployment.id,
                "headers": {"content-type": "application/json"},
                method: 'delete'
            })
                .done(()=> {
                    resolve();
                })
                .fail((jqXHR, textStatus, errorThrown)=>{
                    reject(jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown);
                });
        });
    }

    update() {

    }

    execute(deployment,workflow,params) {
        return new Promise((resolve,reject)=>{
            $.ajax({
                url: this.context.getManagerUrl() + '/api/v2.1/executions',
                "headers": {"content-type": "application/json"},
                method: 'post',
                data: JSON.stringify({
                    'deployment_id': deployment.id,
                    'workflow_id' : workflow.name,
                    parameters: params
                })
            })
                .done((execution)=> {
                    resolve(execution);
                })
                .fail((jqXHR, textStatus, errorThrown)=>{
                    reject(jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)
                });
        });
    }
}