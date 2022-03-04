import request from 'request';
import { noop } from 'lodash';
import { request as requestHandler, getResponseJson } from 'handler/RequestHandler';

jest.mock('request', () => {
    const mockRequest: { pipe: () => typeof mockRequest; on: () => typeof mockRequest } = {
        pipe: jest.fn(),
        on: jest.fn(() => mockRequest)
    };
    return jest.fn(() => mockRequest);
});

describe('RequestHandler', () => {
    it('allows to send an HTTP request', () => {
        const mockRequest = request;
        requestHandler('GET', 'http://test.url');
        expect(mockRequest).toHaveBeenCalledWith('http://test.url', { method: 'GET' });
        expect(mockRequest('').on).toHaveBeenNthCalledWith(1, 'error', noop);
        expect(mockRequest('').on).toHaveBeenNthCalledWith(2, 'response', noop);
    });

    it('allows to parse JSON response', () => {
        const res = <request.Response>(<unknown>{ on: jest.fn() });
        getResponseJson(res);
        expect(res.on).toHaveBeenNthCalledWith(1, 'data', expect.any(Function));
        expect(res.on).toHaveBeenNthCalledWith(2, 'end', expect.any(Function));
    });
});
