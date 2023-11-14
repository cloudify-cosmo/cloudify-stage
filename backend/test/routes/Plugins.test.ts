import request from 'supertest';
import app from 'app';
import { requestAndForwardResponse } from 'handler/RequestHandler';
import { TOKEN_COOKIE_NAME } from '../../consts';

jest.mock('handler/RequestHandler');
jest.mock('handler/ManagerHandler', () => ({
    getManagerUrl: () => '',
    setManagerSpecificOptions: () => ({})
}));

describe('/plugins/icons/:pluginId endpoint', () => {
    it('returns status code 200 if plugin icon does not exist', async () => {
        const mockedResponse = { response: { status: 404 } };

        (<jest.Mock>requestAndForwardResponse).mockRejectedValue(mockedResponse);
        const response = await request(app)
            .get('/console/plugins/icons/cloudify-openstack-plugin')
            .set('Cookie', [`${TOKEN_COOKIE_NAME}=1234`]);

        expect(response.status).toBe(200);
    });
});
