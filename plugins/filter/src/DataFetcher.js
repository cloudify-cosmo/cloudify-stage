/**
 * Created by kinneretzin on 27/10/2016.
 */

export default class DataFetcher{
    static fetch(context) {
        return Promise.all([
            this.fetchBlueprints(context),
            this.fetchDeployments(context),
            this.fetchExecutions(context)
        ]).then( data=>{
            return Promise.resolve({
                blueprints: data[0],
                deployments: data[1],
                executions: data[2]
            });
        })
    }

    static fetchBlueprints(context) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: context.getManagerUrl('/api/v2.1/blueprints?_include=id'),
                dataType: 'json'
            }).done(resolve).fail(reject);
        });

    }

    static fetchDeployments(context) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: context.getManagerUrl('/api/v2.1/deployments?_include=id,blueprint_id'),
                dataType: 'json'
            }).done(resolve).fail(reject)
        });
    }

    static fetchExecutions(context) {
        return new Promise( (resolve,reject) => {
            $.get({
                url: context.getManagerUrl('/api/v2.1/executions?_include=id,blueprint_id,deployment_id,workflow_id'),
                dataType: 'json'
            }).done(resolve).fail(reject);
        });
    }
}
