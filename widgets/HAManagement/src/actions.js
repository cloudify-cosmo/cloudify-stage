/**
 * Created by kinneretzin on 28/03/2017.
 */

const DEFAULT_CLUSTER_NODE_NAME_PREFIX = 'Cluster_Node_';
const WAIT_FOR_CLUSTER_TIMEOUT = 120000;
const WAIT_FOR_CLUSTER_STATUS_PING_INTERVAL = 3000;


function waitPromise (timeout) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        },timeout);
    }) ;
}

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreateCluster(name) {

        return this.toolbox.getManager().doPut(`/cluster`,null,{
            host_ip: this.toolbox.getManager().getIp(),
            node_name: name || (DEFAULT_CLUSTER_NODE_NAME_PREFIX + this.toolbox.getManager().getIp())
        });
    }

    doJoinCluster(clusterManagerIp,clusterManagerUser,clusterManagerPass,name) {
        name = name || (DEFAULT_CLUSTER_NODE_NAME_PREFIX + this.toolbox.getManager().getIp());

        var auth = btoa(`${clusterManagerUser}:${clusterManagerPass}`);
        var external = this.toolbox.getExternal({basicAuth : auth});

        var clusterManager = this.toolbox.getNewManager(clusterManagerIp);

        // Currently this is only available in v3 of the API anyways
        return external.doGet(clusterManager.getManagerUrl('/cluster'),null,true)
            .then(clusterStatus=>{
                if (!clusterStatus.initialized) {
                    return Promise.reject({message: 'The remote manager doesnt belong to any cluster'});
                }

                return Promise.all([
                    // get the current nodes in the cluster, so that we can pass all of
                    // them when joining, which results in faster join, and increases
                    // reliability in case the master dies while we're joining
                    external.doGet(clusterManager.getManagerUrl('/cluster/nodes'), null, true),

                    // also tell the master we want to join to the cluster, let it create new credentials
                    // (ssl keys) for us
                    external.doPut(clusterManager.getManagerUrl(`/cluster/nodes/${name}`), null, {
                        node_name: name,
                        host_ip: this.toolbox.getManager().getIp()
                    }, true)
                ])
            })
            .then(results=>{
                var [nodes, newNode] = results;
                var joinAddrs = _.map(nodes.items,'host_ip');
                return this._doJoinCluster(name, newNode.credentials, joinAddrs);
            })
    }


    _doJoinCluster(name,credentials,joinAddrs) {
        return this.toolbox.getManager().doPut(`/cluster`,null,{
            host_ip: this.toolbox.getManager().getIp(),
            node_name: name,
            credentials: credentials,
            join_addrs: joinAddrs
        });
    }

    waitForClusterInitialization(waitTimeout = (new Date()).getTime() + WAIT_FOR_CLUSTER_TIMEOUT) {

        var pr = this.toolbox.getManager().doGet('/cluster');

        return pr.then(data=>{
            if (!data.initialized) {
                if (data.error) {
                    return Promise.reject(data.error);
                }

                if ((new Date()).getTime() >= waitTimeout) {
                    return Promise.reject('Timed out for waiting for the Cloudify Manager to cluster to be initialized');
                }

                return waitPromise(WAIT_FOR_CLUSTER_STATUS_PING_INTERVAL)
                    .then(()=>this.waitForClusterInitialization(waitTimeout));
            } else {
                return data;
            }
        });
    }

    doDeleteClusterNode(item){
        return this.toolbox.getManager().doDelete(`/cluster/nodes/${item.name}`);
    }

}
