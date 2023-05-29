import request from 'supertest';
import app from 'app';
import { requestAndForwardResponse } from 'handler/RequestHandler';

jest.mock('handler/RequestHandler');

describe('/external/content endpoint', () => {
    const absoluteUrl = 'https://raw.githubusercontent.com/cloudify-cosmo/cloudify-stage/master/package.json';
    const relativeUrl = '/relative';
    const commonAxiosOptions = { maxRedirects: 0, params: {} };

    beforeEach(() => jest.resetAllMocks());

    it('allows to get file content from external URL', () =>
        request(app)
            .get('/console/external/content')
            .query({ url: absoluteUrl })
            .then(() => {
                expect(requestAndForwardResponse).toHaveBeenCalledWith(
                    absoluteUrl,
                    expect.anything(),
                    commonAxiosOptions
                );
            }));

    it('handles relative URLs', () =>
        request(app)
            .get('/console/external/content')
            .query({ url: relativeUrl })
            .then(() => {
                expect(requestAndForwardResponse).toHaveBeenCalledWith(
                    expect.stringMatching(`http://127.0.0.1:\\d+${relativeUrl}`),
                    expect.anything(),
                    commonAxiosOptions
                );
            }));
});
