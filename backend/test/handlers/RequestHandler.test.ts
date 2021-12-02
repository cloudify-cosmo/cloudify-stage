import request from 'request';
import { noop } from 'lodash';
import { request as requestHandler } from 'handler/RequestHandler';

jest.mock('request', () => {
    const mockRequest: { pipe: () => typeof mockRequest; on: () => typeof mockRequest } = {
        pipe: jest.fn(() => mockRequest),
        on: jest.fn(() => mockRequest)
    };
    return jest.fn(() => mockRequest);
});

describe('RequestHandler', () => {
    it('allows to send an HTTP request', () => {
        const mockRequest = request;
        requestHandler('GET', 'http://test.url', {}, noop, noop);
        expect(mockRequest).toHaveBeenCalledWith('http://test.url', { method: 'GET' });
        expect(mockRequest('').on).toHaveBeenCalledTimes(2);
        expect(mockRequest('').on).toHaveBeenCalledWith('error', noop);
        expect(mockRequest('').on).toHaveBeenLastCalledWith('response', noop);
    });
});
