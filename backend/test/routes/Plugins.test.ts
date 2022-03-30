import request from 'supertest';
import app from 'app';
import { TOKEN_COOKIE_NAME } from '../../consts';

jest.mock('handler/ManagerHandler', () => ({
    getManagerUrl: () => 'http://blank.page',
    setManagerSpecificOptions: () => ({})
}));

describe('/plugins/icons/:pluginId endpoint', () => {
    it('returns status code 200 if plugin icon does not exist', () => {
        return request(app)
            .get('/console/plugins/icons/cloudify-aws-plugin')
            .set('Cookie', [`${TOKEN_COOKIE_NAME}=1234`])
            .then(response => {
                expect(response.status).toBe(200);
            });
    });
});
