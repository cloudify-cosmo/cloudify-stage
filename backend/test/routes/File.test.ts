import request from 'supertest';
import app from 'app';
import path from 'path';

describe('/file endpoint', () => {
    it('allows to get text content from text file', () =>
        request(app)
            .post('/console/file/text')
            .attach('file', path.resolve(path.join(__dirname, 'fixtures/example.txt')))
            .then(response => {
                expect(response.type).toContain('application/text');
                expect(response.statusCode).toBe(200);
                expect(response.text).toStrictEqual(
                    expect.stringContaining('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                );
            }));

    it('allows to get JSON content from YAML file', () =>
        request(app)
            .post('/console/file/yaml')
            .attach('file', path.resolve(path.join(__dirname, 'fixtures/terraform/1_blueprint.yaml')))
            .then(response => {
                expect(response.type).toContain('application/json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(
                    expect.objectContaining({
                        tosca_definitions_version: expect.any(String),
                        description: expect.any(String),
                        imports: expect.any(Array)
                    })
                );
            }));
});
