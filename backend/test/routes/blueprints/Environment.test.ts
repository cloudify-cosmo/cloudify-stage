import yaml from 'js-yaml';
import request from 'supertest';
import { size } from 'lodash';
import type { Blueprint } from 'cloudify-ui-common-backend';
import app from '../../../app';
import type { PostEnvironmentBlueprintRequestBody } from '../../../routes/blueprints/Environment.types';

describe('/environment/blueprint endpoint', () => {
    function assertConstantPart(blueprint: Blueprint) {
        expect(blueprint.tosca_definitions_version).toEqual('cloudify_dsl_1_4');

        const { imports, node_templates: nodeTemplates } = blueprint;
        expect(imports).toHaveLength(1);
        expect(imports![0]).toEqual('cloudify/types/types.yaml');

        expect(size(nodeTemplates)).toEqual(1);

        const environmentNode = nodeTemplates!.EnvironmentNode;
        expect(size(environmentNode)).toEqual(1);
        expect(environmentNode.type).toEqual('cloudify.nodes.Root');
    }

    function assertLabels(blueprint: Blueprint, extraKey?: string, extraValue?: string) {
        const labels: Blueprint['labels'] = { 'csys-obj-type': { values: ['environment'] } };
        if (extraKey && extraValue) labels[extraKey] = { values: [extraValue] };
        expect(blueprint.labels).toEqual(labels);
        expect(blueprint.blueprint_labels).toEqual(labels);
    }

    it(`generates minimal environment blueprint`, async () => {
        const response = await request(app)
            .post('/console/environment/blueprint')
            .send({ description: '', labels: [], capabilities: [] });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');

        const generatedBlueprint = yaml.load(response.text) as Blueprint;
        expect(size(generatedBlueprint)).toEqual(5);
        assertConstantPart(generatedBlueprint);
        assertLabels(generatedBlueprint);
    });

    it(`generates full environment blueprint`, async () => {
        function assertInput(key: string, defaultValue?: any) {
            const input = generatedBlueprint.inputs![key];
            expect(size(input)).toEqual(defaultValue ? 2 : 1);
            expect(input.type).toEqual('string');
            expect(input.default).toEqual(defaultValue);
        }

        function assertCapability(key: string, value: any) {
            const capability = generatedBlueprint.capabilities![key];
            expect(size(capability)).toEqual(1);
            expect(capability.value).toEqual(value);
        }

        function assertInputCapability(key: string) {
            assertCapability(key, { get_input: key });
        }

        const body: PostEnvironmentBlueprintRequestBody = {
            description: 'description',
            labels: [
                { key: 'user', value: 'danny', blueprintDefault: false },
                { key: 'app', value: 'platform', blueprintDefault: true }
            ],
            capabilities: [
                { name: 'team', source: 'input', blueprintDefault: false, value: 'TeamA' },
                { name: 'unit', source: 'input', blueprintDefault: true, value: 'UnitA' },
                { name: 'region', source: 'static', value: 'US-WEST' },
                { name: 'key', source: 'secret', blueprintDefault: false, value: 'MySecretKey' },
                { name: 'cert', source: 'secret', blueprintDefault: true, value: 'MySecretCert' }
            ]
        };

        const response = await request(app).post('/console/environment/blueprint').send(body);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');

        const generatedBlueprint = yaml.load(response.text) as Blueprint;
        expect(size(generatedBlueprint)).toEqual(8);
        assertConstantPart(generatedBlueprint);
        expect(generatedBlueprint.description).toEqual(body.description);

        expect(size(generatedBlueprint.inputs)).toEqual(4);
        assertInput(body.capabilities[0].name);
        assertInput(body.capabilities[1].name, body.capabilities[1].value);
        assertInput(body.capabilities[3].name);
        assertInput(body.capabilities[4].name, { get_secret: body.capabilities[4].value });

        assertLabels(generatedBlueprint, body.labels[1].key, body.labels[1].value);

        expect(size(generatedBlueprint.capabilities)).toEqual(5);
        assertInputCapability(body.capabilities[0].name);
        assertInputCapability(body.capabilities[1].name);
        assertCapability(body.capabilities[2].name, body.capabilities[2].value);
        assertInputCapability(body.capabilities[3].name);
        assertInputCapability(body.capabilities[4].name);
    });
});
