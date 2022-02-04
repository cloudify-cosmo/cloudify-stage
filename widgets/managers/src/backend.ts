// @ts-nocheck File not migrated fully to TS
export default r => {
    r.register('get_cluster_status', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        const logger = helper.Logger('get_cluster_status');

        const {
            query: { deploymentId },
            headers
        } = req;

        const getClusterStatus = (ip, username, password, tenant, certificate) => {
            const endpointUrl = `http://${ip}/api/v3.1/cluster-status`;
            logger.debug(`Calling: GET ${endpointUrl}`);

            return helper.Request.doGet(`http://${ip}/api/v3.1/cluster-status`, {
                headers: {
                    tenant,
                    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                },
                certificate
            });
        };

        const extractCredentials = (capabilitiesPromise, usernameSecretPromise, passwordSecretPromise) => {
            const ip = _.get(capabilitiesPromise, 'capabilities.endpoint');
            const cert = _.get(capabilitiesPromise, 'capabilities.endpoint_certificate');
            const username = _.get(usernameSecretPromise, 'value');
            const password = _.get(passwordSecretPromise, 'value');
            const tenant = 'default_tenant';

            logger.debug(`Extracted data: ip=${ip}, user=${username}, cert=${cert ? 'present' : 'not present'}`);
            return {
                ip,
                username,
                password,
                tenant,
                cert
            };
        };

        const managerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                'Authentication-Token': headers['authentication-token']
            }
        };
        const capabilitiesPromise = helper.Manager.doGet(
            `/deployments/${deploymentId}/capabilities`,
            managerRequestOptions
        ).catch(error => {
            logger.error(error);
            return Promise.reject(new Error('Cannot fetch IP address and certificate of the endpoint'));
        });
        const passwordSecretPromise = helper.Manager.doGet(
            '/secrets/manager_admin_password',
            managerRequestOptions
        ).catch(() => 'admin');
        const usernameSecretPromise = helper.Manager.doGet(
            '/secrets/manager_admin_username',
            managerRequestOptions
        ).catch(() => 'admin');

        Promise.all([capabilitiesPromise, usernameSecretPromise, passwordSecretPromise])
            .then(([capabilities, usernameSecret, passwordSecret]) =>
                extractCredentials(capabilities, usernameSecret, passwordSecret)
            )
            .then(({ ip, username, password, tenant, cert }) => getClusterStatus(ip, username, password, tenant, cert))
            .then(clusterStatus => res.send(clusterStatus))
            .catch(error => next(error));
    });

    r.register('get_spire_deployments', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');

        const { headers } = req;
        const commonManagerRequestOptions = {
            headers: {
                tenant: headers.tenant,
                'Authentication-Token': headers['authentication-token']
            }
        };
        let spireDeployments = [];

        return helper.Manager.doGetFull('/deployments', {
            params: {
                _include: 'id,workflows,capabilities,description,latest_execution',
                description:
                    'This blueprint creates several VMs, installs a Manager on each of them, ' +
                    'creates a Spire Management Cluster between all the managers and uploads ' +
                    'several auxiliary resources to the cluster.\n'
            },
            ...commonManagerRequestOptions
        })
            .then(data => {
                spireDeployments = data.items;
                const capabilitiesPromises = _.map(spireDeployments, deployment =>
                    helper.Manager.doGet(`/deployments/${deployment.id}/capabilities`, commonManagerRequestOptions)
                );

                const latestExecutionIds = _.map(data.items, item => item.latest_execution);
                const executionsPromise = helper.Manager.doGet('/executions', {
                    params: {
                        id: latestExecutionIds
                    },
                    ...commonManagerRequestOptions
                });

                return Promise.all([executionsPromise, ...capabilitiesPromises]);
            })
            .then(([executions, ...spireDeploymentsCapabilities]) => {
                const executionsData = _.groupBy(executions.items, 'deployment_id');

                return Promise.resolve({
                    items: _.sortBy(
                        _.map(spireDeploymentsCapabilities, deploymentCapabilities => {
                            const spireDeploymentId = deploymentCapabilities.deployment_id;
                            const spireEndpointIp = _.get(deploymentCapabilities.capabilities, 'endpoint', '');
                            const deployment = _.find(
                                spireDeployments,
                                d => d.id === deploymentCapabilities.deployment_id
                            );
                            const workflows = _.get(deployment, 'workflows', []);

                            return {
                                id: spireDeploymentId,
                                ip: spireEndpointIp,
                                workflows,
                                lastExecution: _.first(executionsData[spireDeploymentId])
                            };
                        }),
                        'id'
                    ),
                    total: _.size(spireDeploymentsCapabilities)
                });
            })
            .then(data => res.send(data))
            .catch(error => next(error));
    });
};
