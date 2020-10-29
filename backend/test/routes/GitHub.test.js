const request = require('supertest');
const app = require('app');

describe('/github endpoint', () => {
    it('allows to GET file content from GitHub repository', () => {
        return new Promise(done => {
            request(app)
                .get('/console/github/content/cloudify-cosmo/cloudify-stage/master/LICENSE')
                .then(response => {
                    expect(response.type).toContain('text/plain');
                    expect(response.statusCode).toBe(200);
                    expect(response.text).toStrictEqual(expect.stringContaining('Apache License'));
                    done();
                });
        });
    });
});
