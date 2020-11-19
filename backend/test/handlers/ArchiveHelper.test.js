const { saveDataFromUrl } = require('handler/ArchiveHelper');
const RequestHandler = require('handler/RequestHandler');

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((method, url, headers, data, onSuccess, onError) => onError())
}));

describe('ArchiveHelper', () => {
    it('fetches extenral data with correct headers', () => {
        return saveDataFromUrl('').catch(() =>
            expect(RequestHandler.request).toHaveBeenCalledWith(
                'GET',
                expect.any(String),
                expect.objectContaining({ headers: { 'User-Agent': 'Node.js' } }),
                expect.anything(),
                expect.anything()
            )
        );
    });
});
