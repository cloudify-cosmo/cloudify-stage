import request from 'supertest';
import { join, resolve } from 'path';
import app from 'app';

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
        const spy = jest.spyOn(ejs, 'render').mockImplementation(() => {
            throw Error('err');
        });
        const response = await request(app).post('/console/terraform/blueprint').send(getInputs(1));

        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
            message: 'Error when generating blueprint'
        });
        spy.mockRestore();
    });
});

describe('/terraform/blueprint/archive endpoint', () => {
    const endpointUrl = '/console/terraform/blueprint/archive';

    const getFixturePath = (filename: string) => resolve(join(__dirname, `fixtures/terraform/${filename}`));

    const requestBody = readJsonSync(getFixturePath(`archive_inputs.json`));

    it(`generates Terraform blueprint archive`, async () => {
        const response = await request(app).post(endpointUrl).send(requestBody);
        console.log('response', response.text, response.body);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/zip');
    });

    it('handles ejs errors', async () => {
        const spy = jest.spyOn(ejs, 'render').mockImplementation(() => {
            throw Error('err');
        });
        const response = await request(app).post(endpointUrl).send(requestBody);
        console.log('response2', response.text, response.body);
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
            message: 'Error when generating blueprint'
        });
        spy.mockRestore();
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
