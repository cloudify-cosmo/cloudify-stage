module.exports = r => {
    r.register('get_cluster_status', 'GET', (req, res, next, helper) => {
        const _ = require('lodash');
        const logger = helper.Logger('get_cluster_status');

        const {
            query: { deploymentId },
            headers
        } = req;
        const extractedHeaders = {
            tenant: headers.tenant,
            'Authentication-Token': headers['authentication-token']
        };

        const getClusterStatus = (ip, username, password, tenant, certificate) => {
            const endpointUrl = `http://${ip}/api/v3.1/cluster-status`;
            const endpointHeaders = {
                tenant,
                Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
            };
            logger.debug(`Calling: GET ${endpointUrl}`);

            return helper.Request.doGet(
                `http://${ip}/api/v3.1/cluster-status`,
                null,
                true,
                endpointHeaders,
                certificate
            );
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

        const capabilitiesPromise = helper.Manager.doGet(
            `/deployments/${deploymentId}/capabilities`,
            null,
            extractedHeaders
        ).catch(error => {
            logger.error(error);
            return Promise.reject(new Error('Cannot fetch IP address and certificate of the endpoint'));
        });
        const passwordSecretPromise = helper.Manager.doGet(
            '/secrets/manager_admin_password',
            null,
            extractedHeaders
        ).catch(() => 'admin');
        const usernameSecretPromise = helper.Manager.doGet(
            '/secrets/manager_admin_username',
            null,
            extractedHeaders
        ).catch(() => 'admin');

        Promise.all([capabilitiesPromise, usernameSecretPromise, passwordSecretPromise])
            .then(([capabilities, usernameSecret, passwordSecret]) =>
                extractCredentials(capabilities, usernameSecret, passwordSecret)
            )
            .then(({ ip, username, password, tenant, cert }) => getClusterStatus(ip, username, password, tenant, cert))
            .then(clusterStatus => res.send(clusterStatus))
            .catch(error => next(error));
    });
};
