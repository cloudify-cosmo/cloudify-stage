const RequestService = require('handler/services/RequestService');
const RequestHandler = require('handler/RequestHandler');

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((method, url, options, onSuccess) =>
        onSuccess({ headers: {}, statusCode: 200, on: (eventName, callback) => callback('responseData') })
    )
}));

describe('RequestService', () => {
    it('performs GET request', () => {
        return RequestService.doGet().then(response => {
            expect(RequestHandler.request).toHaveBeenCalledWith(
                'GET',
                undefined,
                { headers: {} },
                expect.anything(),
                expect.anything()
            );
            expect(response).toEqual('responseData');
        });
    });
});
