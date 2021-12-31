import request from 'supertest';
import app from 'app';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { readJsonSync } from 'fs-extra';
import ejs from 'ejs';
import nock from 'nock';

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

    it('handles ejs errors', async () => {
        ejs.render = () => {
            throw Error('err');
        };
        const response = await request(app).post('/console/terraform/blueprint').send(getInputs(1));

        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
            message: 'Error when generating blueprint'
        });
    });
});

describe('/terraform/resources endpoint', () => {
    it('provides modules list', async () => {
        const authorizationHeaderValue = 'auth';

        nock(/test/, { reqheaders: { authorization: authorizationHeaderValue } })
            .get(`/test.zip`)
            .reply(200, readFileSync(resolve(__dirname, 'fixtures/terraform/template.zip'), null));

        const response = await request(app)
            .post('/console/terraform/resources?zipUrl=http://test/test.zip')
            .set('Authorization', authorizationHeaderValue)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(['local', 'local/nested/subdir', 'local/subdir', 'local3']);
    });
});
