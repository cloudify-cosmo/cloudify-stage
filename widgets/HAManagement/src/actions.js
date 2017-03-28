/**
 * Created by kinneretzin on 28/03/2017.
 */

const DEFAULT_CLUSTER_NODE_NAME_PREFIX = 'Cluster_Node_';
const WAIT_FOR_CLUSTER_TIMEOUT = 120000;
const WAIT_FOR_CLUSTER_STATUS_PING_INTERVAL = 3000;

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function genString(length) {
    var bytes = '';
    for (var i=0;i<length;++i) {
        bytes += randomIntInc(0, 9);
    }

    return bytes;
}

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
            node_name: name || (DEFAULT_CLUSTER_NODE_NAME_PREFIX + this.toolbox.getManager().getIp()),
            encryption_key: btoa(genString(16))
        });
    }

    doJoinCluster(clusterManagerIp,clusterManagerUser,clusterManagerPass,name) {

        var auth = btoa(`${clusterManagerUser}:${clusterManagerPass}`);
        var external = this.toolbox.getExternal({basicAuth : auth});

        var cluster = {};
        var tenant = null;
        var clusterManager = this.toolbox.getNewManager(clusterManagerIp);

        // Currently this is only available in v3 of the API anyways
        return external.doGet(clusterManager.getManagerUrl('/tenants'))
            .then(tenants=>{
                if (tenants.items.length === 0) {
                    return Promise.reject('The remote manager doesnt have any tenants');
                }

                tenant = tenants.items[0].name;
                return external.doGet(clusterManager.getManagerUrl('/cluster'),null,true,{tenant});
            })
            .then(clusterStatus=>{
                if (!clusterStatus.initialized) {
                    return Promise.reject({message: 'The remote manager doesnt belong to any cluster'});
                }

                // Save the cluster info
                cluster = clusterStatus;

                // Get the list of nodes
                return external.doGet(clusterManager.getManagerUrl('/cluster/nodes'),null,true,{tenant});
            })
            .then(clusterNodes=>{
                if (!_.isEmpty(name) && _.find(clusterNodes.items,{name:name}))  {
                    return Promise.reject(`A node named ${name} already exists in the cluster`);
                }

                var joinAddrs = _.map(clusterNodes.items,'host_ip');

                return this._doJoinCluster(name,cluster.encryption_key,joinAddrs);
            });
    }


    _doJoinCluster(name,encryptionKey,joinAddrs) {
        return this.toolbox.getManager().doPut(`/cluster`,null,{
            host_ip: this.toolbox.getManager().getIp(),
            node_name: name || (DEFAULT_CLUSTER_NODE_NAME_PREFIX + this.toolbox.getManager().getIp()),
            encryption_key: encryptionKey,
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
