import request from 'supertest';
import app from 'app';

describe('/external/content endpoint', () => {
    it('allows to get file content from external URL', () =>
        request(app)
            .get('/console/external/content')
            .query({ url: 'https://raw.githubusercontent.com/cloudify-cosmo/cloudify-stage/master/package.json' })
            .then(response => {
                expect(response.type).toContain('text/plain');
                expect(response.statusCode).toBe(200);
                expect(response.text).toStrictEqual(expect.stringContaining('"name": "cloudify-stage"'));
            }));
});
