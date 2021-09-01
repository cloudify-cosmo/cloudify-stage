// @ts-nocheck File not migrated fully to TS
import { saveDataFromUrl } from 'handler/ArchiveHelper';
import { request } from 'handler/RequestHandler';

jest.mock('handler/ManagerHandler');

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((method, url, headers, data, onSuccess, onError) => onError())
}));

describe('ArchiveHelper', () => {
    it('fetches extenral data with correct headers', () => {
        expect.assertions(1);
        const url = 'http://wp';
        return saveDataFromUrl(url).catch(() =>
            expect(request).toHaveBeenCalledWith(
                'GET',
                url,
                expect.objectContaining({ options: { headers: { 'User-Agent': 'Node.js' } } }),
                expect.anything(),
                expect.anything()
            )
        );
    });
});
