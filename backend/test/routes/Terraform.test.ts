import request from 'supertest';
import app from 'app';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { readJsonSync } from 'fs-extra';

describe('/terraform/blueprint endpoint', () => {
    const getFixturePath = (filename: string) => resolve(join(__dirname, `fixtures/terraform/${filename}`));
    const getInputs = (id: number) => readJsonSync(getFixturePath(`${id}_inputs.json`));
    const getBlueprint = (id: number) => readFileSync(getFixturePath(`${id}_blueprint.yaml`), 'utf8');
    const testCases = [
        { id: 1, description: 'all parameters provided' },
        { id: 2, description: 'only required parameters provided' }
    ];

    testCases.forEach(testCase => {
        const requestBody = getInputs(testCase.id);
        const responseBody = getBlueprint(testCase.id);

        it(`generates Terraform blueprint - ${testCase.description}`, async () => {
            const response = await request(app).post('/console/terraform/blueprint').send(requestBody);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('text/x-yaml; charset=utf-8');
            expect(response.text).toEqual(responseBody);
        });
    });
});
