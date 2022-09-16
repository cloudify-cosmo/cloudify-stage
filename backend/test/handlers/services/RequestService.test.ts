import { doGet } from 'handler/services/RequestService';
import { request } from 'handler/RequestHandler';

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((_method, _url, _options) =>
        Promise.resolve({ headers: {}, statusCode: 200, data: 'responseData' })
    )
}));

describe('RequestService', () => {
    it('performs GET request', () => {
        return doGet('', {}).then(response => {
            expect(request).toHaveBeenCalledWith('GET', undefined, { headers: {} });
            expect(response).toEqual('responseData');
        });
    });
});
