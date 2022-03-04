import request from 'supertest';
import nock from 'nock';

import app from 'app';
import { setManagerSpecificOptions } from 'handler/ManagerHandler';

const mockApiUrl = 'https://raw.githubusercontent.com';
const mockTimeout = 1000;

jest.mock('handler/ManagerHandler', () => ({
    getApiUrl: () => mockApiUrl,
    updateOptions: jest.fn(options => {
        options.timeout = mockTimeout;
    })
}));

describe('/sp endpoint', () => {
    const blueprintsUrl = '/blueprints';
    const proxyBlueprintsUrl = `/console/sp${blueprintsUrl}`;

    // NOTE: prevents memory leaks
    // See https://github.com/nock/nock/issues/2057#issuecomment-702401375
    beforeEach(() => {
        if (!nock.isActive()) {
            nock.activate();
        }
    });
    afterEach(() => {
        nock.restore();
    });

    it('sets manager request options', () => {
        nock(mockApiUrl).put(blueprintsUrl).reply(200);

        return request(app)
            .put(proxyBlueprintsUrl)
            .then(response => {
                expect(setManagerSpecificOptions).toHaveBeenCalledWith(expect.any(Object), 'PUT');
                expect(response.statusCode).toBe(200);
            });
    });

    it('returns an error when the Manager is not available', () => {
        nock(mockApiUrl).put(blueprintsUrl).replyWithError({ connect: true });

        return request(app)
            .put(proxyBlueprintsUrl)
            .then(response => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    message: expect.stringContaining('Manager is not available')
                });
            });
    });

    it('returns an error when the connection times out', () => {
        // NOTE: using nock's `delayConnection` only yielded `ESOCKETTIMEDOUT`s
        // despite it being tested in https://github.com/nock/nock/blob/7f7c7b7d34177091b40660a755389dca80ea2fc5/tests/test_delay.js#L207
        // Thus, manually causing `ETIMEDOUT`
        // See https://stackoverflow.com/a/41469139/4874344
        nock(mockApiUrl).put(blueprintsUrl).replyWithError({ code: 'ETIMEDOUT' });

        return request(app)
            .put(proxyBlueprintsUrl)
            .then(response => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    message: expect.stringContaining('Request timed out')
                });
            });
    });

    it('returns an error when the socket times out after a successful connection', () => {
        nock(mockApiUrl)
            .put(blueprintsUrl)
            .delayConnection(mockTimeout + 1)
            .reply(200);

        return request(app)
            .put(proxyBlueprintsUrl)
            .then(response => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    message: expect.stringContaining('Connected to the Manager but timed out')
                });
            });
    });
});
