import request from 'supertest';
import app from 'app';
import { requestAndForwardResponse } from 'handler/RequestHandler';

jest.mock('handler/RequestHandler');
jest.mock('handler/ManagerHandler', () => ({
    getManagerUrl: () => 'http://blank.page',
    setManagerSpecificOptions: () => ({})
}));

describe('/ba endpoint', () => {
    it('allows to get blueprint image', () => {
        (<jest.Mock>requestAndForwardResponse).mockRejectedValue('');
        return request(app)
            .get('/console/ba/image/default_tenant/my_blueprint')
            .then(() => {
                expect(requestAndForwardResponse).toHaveBeenCalledWith(
                    'http://blank.page/resources/blueprints/default_tenant/my_blueprint/icon.png',
                    expect.anything(),
                    expect.anything()
                );
            });
    });
});
