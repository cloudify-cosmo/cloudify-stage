import request from 'supertest';
import app from 'app';

jest.mock('handler/ManagerHandler');
jest.mock('handler/GitHubHandler', () => ({
    ...jest.requireActual('../../handler/GitHubHandler'),
    pipeRequest: jest.fn((_, res) => {
        res.status(200).type('text/plain').send('Apache License');
    })
}));

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
