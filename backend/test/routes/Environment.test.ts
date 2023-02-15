import { readFileSync } from 'fs';
import request from 'supertest';
import { join } from 'path';
import app from '../../app';
import type { PostEnvironmentBlueprintRequestBody } from '../../routes/Environment.types';

describe('/environment/blueprint endpoint', () => {
    it(`generates minimal environment blueprint`, async () => {
        const expectedBlueprint = readFileSync(join(__dirname, `fixtures/environment/blueprint_minimal.yaml`), 'utf8');
        const response = await request(app)
            .post('/console/environment/blueprint')
            .send({ description: '', labels: [], capabilities: [] });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');
        expect(response.text).toEqual(expectedBlueprint);
    });

    it(`generates full environment blueprint`, async () => {
        const expectedBlueprint = readFileSync(join(__dirname, `fixtures/environment/blueprint_full.yaml`), 'utf8');

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
        expect(response.text).toEqual(expectedBlueprint);
    });
});
