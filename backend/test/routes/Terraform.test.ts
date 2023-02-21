import request from 'supertest';
import { join, resolve } from 'path';
import app from 'app';

import { readFileSync } from 'fs';
import { readJsonSync } from 'fs-extra';
import nock from 'nock';
import yaml from 'js-yaml';
import { size } from 'lodash';
import type { Blueprint } from 'cloudify-ui-common-backend';

const getFixturePath = (filename: string) => resolve(join(__dirname, `fixtures/terraform/${filename}`));
const getInputs = (id: 'full' | 'minimal' | 'fetch-data-file' | 'fetch-data') =>
    readJsonSync(getFixturePath(`inputs_${id}.json`));

describe('/terraform/blueprint endpoint', () => {
    function assertCommonPart(blueprint: Blueprint) {
        expect(blueprint.tosca_definitions_version).toEqual('cloudify_dsl_1_4');

        const { imports, node_templates: nodeTemplates } = blueprint;

        expect(imports).toHaveLength(2);
        expect(imports![0]).toEqual('cloudify/types/types.yaml');
        expect(imports![1]).toEqual('plugin:cloudify-terraform-plugin');

        expect(size(nodeTemplates)).toEqual(2);

        const terraformNode = nodeTemplates!.terraform;
        expect(size(terraformNode)).toEqual(2);
        expect(terraformNode.type).toEqual('cloudify.nodes.terraform');
        const terraformProperties = terraformNode.properties;
        expect(size(terraformProperties)).toEqual(1);
        const terraformResourceConfig = terraformProperties?.resource_config;
        expect(size(terraformResourceConfig)).toEqual(1);
        expect(terraformResourceConfig.installation_source).toEqual(
            'https://releases.hashicorp.com/terraform/1.2.2/terraform_1.2.2_linux_amd64.zip'
        );

        const cloudResources = nodeTemplates!.cloud_resources;
        expect(size(cloudResources)).toEqual(3);
        expect(cloudResources.type).toEqual('cloudify.nodes.terraform.Module');

        const cloudRedourcesProperties = cloudResources.properties;
        expect(size(cloudRedourcesProperties)).toEqual(1);

        const cloudResourcesResourceConfig = cloudRedourcesProperties?.resource_config;
        expect(cloudResourcesResourceConfig.source.location).toEqual('http://host/path/template.zip');
        expect(cloudResourcesResourceConfig.source_path).toEqual('/ft_folder/template');

        const cloudResourcesRelalionships = cloudResources.relationships;
        expect(cloudResourcesRelalionships?.length).toEqual(1);

        const cloudResourcesTerraformRelationship = cloudResourcesRelalionships?.[0];
        expect(size(cloudResourcesTerraformRelationship)).toEqual(2);
        expect(cloudResourcesTerraformRelationship?.target).toEqual('terraform');
        expect(cloudResourcesTerraformRelationship?.type).toEqual('cloudify.terraform.relationships.run_on_host');
    }

    it(`generates Terraform blueprint - all parameters provided`, async () => {
        function assertIntrinsicFunction(propertyValue: any, intrinsicFunction: string, argument: any) {
            expect(size(propertyValue)).toEqual(1);
            expect(propertyValue[intrinsicFunction]).toEqual(argument);
        }

        function assertGetInput(propertyValue: any, argument: any) {
            assertIntrinsicFunction(propertyValue, 'get_input', argument);
        }

        function assertGetSecret(propertyValue: any, argument: any) {
            assertIntrinsicFunction(propertyValue, 'get_secret', argument);
        }

        function assertOutputs(name: 'outputs' | 'capabilities', outputName: string, mappedOutputName: string) {
            const outputs = generatedBlueprint[name];
            expect(size(outputs)).toEqual(1);
            const output = outputs?.[outputName];
            expect(size(output)).toEqual(1);
            assertIntrinsicFunction(output?.value, 'get_attribute', [
                'cloud_resources',
                'outputs',
                mappedOutputName,
                'value'
            ]);
        }

        const requestBody = getInputs('full');
        const response = await request(app).post('/console/terraform/blueprint').send(requestBody);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');

        const generatedBlueprint = yaml.load(response.text) as Blueprint;
        expect(size(generatedBlueprint)).toEqual(7);

        assertCommonPart(generatedBlueprint);

        expect(generatedBlueprint.description).toEqual('bpDescription');

        const { inputs } = generatedBlueprint;
        expect(size(inputs)).toEqual(2);
        const { inputA, inputC } = inputs!;
        expect(size(inputA)).toEqual(2);
        expect(inputA.type).toEqual('string');
        expect(inputA.default).toEqual('defaultB');
        expect(size(inputC)).toEqual(1);
        expect(inputC.type).toEqual('string');

        const cloudResourcesResourceConfig =
            generatedBlueprint.node_templates?.cloud_resources.properties?.resource_config;
        const { source, variables, environment_variables: environmentVariables } = cloudResourcesResourceConfig;
        expect(size(source)).toEqual(3);
        const { username, password } = source;
        assertGetSecret(username, 'bpName.username');
        assertGetSecret(password, 'bpName.password');

        expect(size(variables)).toEqual(3);
        const { variableA, variableB, variableD } = variables;
        assertGetSecret(variableA, 'secretA');
        assertGetInput(variableB, 'inputA');
        expect(variableD).toEqual('defaultD');
        assertGetInput(environmentVariables.variableC, 'inputC');

        assertOutputs('outputs', 'outputA', 'outA');
        assertOutputs('capabilities', 'outputB', 'outB');
    });

    it(`generates Terraform blueprint - only required parameters provided`, async () => {
        const requestBody = getInputs('minimal');
        const response = await request(app).post('/console/terraform/blueprint').send(requestBody);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');

        const generatedBlueprint = yaml.load(response.text) as Blueprint;
        expect(size(generatedBlueprint)).toEqual(4);

        assertCommonPart(generatedBlueprint);

        expect(size(generatedBlueprint.node_templates!.cloud_resources.properties?.resource_config)).toEqual(2);
        expect(size(generatedBlueprint.node_templates!.cloud_resources.properties?.resource_config.source)).toEqual(1);

        expect(generatedBlueprint.description).toEqual('');
    });
});

describe('/terraform/blueprint/archive endpoint', () => {
    const endpointUrl = '/console/terraform/blueprint/archive';

    const requestBody = readJsonSync(getFixturePath(`archive_inputs.json`));

    it(`generates Terraform blueprint archive`, async () => {
        const response = await request(app).post(endpointUrl).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/zip');
    });
});

describe('/terraform/resources endpoint', () => {
    const endpointUrl = '/console/terraform/resources';

    it('provides modules list', async () => {
        const authorizationHeaderValue = 'auth';

        nock(/test/, { reqheaders: { authorization: authorizationHeaderValue } })
            .get(`/test.zip`)
            .reply(200, readFileSync(resolve(__dirname, 'fixtures/terraform/template.zip'), null));

        const response = await request(app)
            .post(endpointUrl)
            .query({ templateUrl: 'http://test/test.zip' })
            .set('Authorization', authorizationHeaderValue)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(['local', 'local/nested/subdir', 'local/subdir', 'local3']);
    });

    it('handles error from accessing the private repository without passing credentials', async () => {
        const privateGitFileUrl = 'https://github.com/cloudify-cosmo/cloudify-blueprint-composer.git';
        const response = await request(app).post(endpointUrl).query({ templateUrl: privateGitFileUrl }).send();

        expect(response.status).toBe(400);
    });
});

describe('/terraform/resources/file endpoint', () => {
    const endpointUrl = '/console/terraform/resources/file';

    it('provides modules list', async () => {
        const response = await request(app)
            .post(endpointUrl)
            .attach('file', resolve(join(__dirname, 'fixtures/terraform/template.zip')));

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(['local', 'local/nested/subdir', 'local/subdir', 'local3']);
    });
});

describe('/terraform/fetch-data endpoint', () => {
    const endpointUrl = '/console/terraform/fetch-data';

    it('returns outputs and variables in response', async () => {
        const requestBody = getInputs('fetch-data');

        nock(/test/)
            .get(`/test.zip`)
            .reply(200, readFileSync(resolve(__dirname, 'fixtures/terraform/template_fetch-data.zip'), null));

        const response = await request(app).post(endpointUrl).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body?.outputs.ip?.name).toEqual('ip');
        expect(response.body?.variables?.filename?.name).toEqual('filename');
        expect(response.body?.variables?.filename?.default).toEqual('cloud-config.cfg');
    });
});

describe('/terraform/fetch-data/file endpoint', () => {
    const endpointUrl = '/console/terraform/fetch-data/file';

    it('returns outputs and variables in response', async () => {
        const requestBody = getInputs('fetch-data-file');

        const response = await request(app).post(endpointUrl).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body?.outputs.ip?.name).toEqual('ip');
        expect(response.body?.variables?.filename?.name).toEqual('filename');
        expect(response.body?.variables?.filename?.default).toEqual('cloud-config.cfg');
    });
});
