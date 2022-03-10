// @ts-nocheck File not migrated fully to TS
import { doGet } from 'handler/services/RequestService';
import { request } from 'handler/RequestHandler';

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((method, url, options) => Promise.resolve({ headers: {}, statusCode: 200, data: 'responseData' }))
}));

describe('RequestService', () => {
    it('performs GET request', () => {
        return doGet().then(response => {
            expect(request).toHaveBeenCalledWith('GET', undefined, { headers: {} });
            expect(response).toEqual('responseData');
        });
    });
});
