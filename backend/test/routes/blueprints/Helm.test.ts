import yaml from 'js-yaml';
import request from 'supertest';
import { size } from 'lodash';
import type { Blueprint } from 'cloudify-ui-common-backend';
import app from '../../../app';
import type { PostHelmBlueprintRequestBody } from '../../../routes/Helm.types';
import type { ClusterCredentialName } from '../../../handler/HelmHandler.types';
import { assertGetInput, assertGetSecret, assertIntrinsicFunction } from './common';

describe('/helm/blueprint endpoint', () => {
    it(`generates blueprint`, async () => {
        function assertInput(name: ClusterCredentialName) {
            expect(generatedBlueprint.inputs?.[requestBody.clusterCredentials[name].value]).toEqual({ type: 'string' });
        }

        const requestBody: PostHelmBlueprintRequestBody = {
            description: 'blueprint description',
            chart: 'helm chart',
            repository: 'test.repo',
            clusterCredentials: {
                host: { source: 'input', value: 'input1Name' },
                api_key: { source: 'secret', value: 'secretKey' },
                ssl_ca_cert: { source: 'input', value: 'input2Name' }
            }
        };
        const response = await request(app).post('/console/helm/blueprint').send(requestBody);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');

        const generatedBlueprint = yaml.load(response.text) as Blueprint;
        expect(size(generatedBlueprint.inputs)).toEqual(2);
        assertInput('host');
        assertInput('ssl_ca_cert');

        const nodeTemplates = generatedBlueprint.node_templates;
        expect(nodeTemplates?.repo.properties?.resource_config.repo_url).toEqual(requestBody.repository);

        const releaseProperties = nodeTemplates?.release.properties;
        expect(releaseProperties?.resource_config.chart).toEqual(requestBody.chart);
        const releaseApiOptions = releaseProperties?.client_config.configuration.api_options;
        assertGetInput(releaseApiOptions.host, requestBody.clusterCredentials.host.value);
        assertGetInput(releaseApiOptions.ssl_ca_cert, requestBody.clusterCredentials.ssl_ca_cert.value);
        assertGetSecret(releaseApiOptions.api_key, requestBody.clusterCredentials.api_key.value);

        const svcApiOptions = nodeTemplates?.svc.properties?.client_config.configuration.api_options;
        assertIntrinsicFunction(svcApiOptions.host, 'concat', [
            'https://',
            { get_input: requestBody.clusterCredentials.host.value }
        ]);
        assertGetInput(svcApiOptions.ssl_ca_cert, requestBody.clusterCredentials.ssl_ca_cert.value);
        assertGetSecret(svcApiOptions.api_key, requestBody.clusterCredentials.api_key.value);
    });
});
