import { doGet } from 'handler/services/SandboxService';
import { request } from 'handler/RequestHandler';

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((_method, _url, _options) =>
        Promise.resolve({ headers: {}, statusCode: 200, data: 'responseData' })
    )
}));

describe('SandboxService', () => {
    it('performs GET request', () => {
        return doGet('request', '', '{}').then(response => {
            expect(request).toHaveBeenCalledWith('GET', '', { headers: {} });
            expect(response).toEqual(JSON.stringify('responseData'));
        });
    });
});
