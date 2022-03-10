import request from 'supertest';
import app from 'app';

jest.mock('handler/ManagerHandler');

describe('/github endpoint', () => {
    it('allows to GET file content from GitHub repository', () =>
        request(app)
            .get('/console/github/content/cloudify-cosmo/cloudify-stage/master/LICENSE')
            .then(response => {
                expect(response.text).toStrictEqual(expect.stringContaining('Apache License'));
                expect(response.statusCode).toBe(200);
                expect(response.type).toContain('text/plain');
            }));
});
