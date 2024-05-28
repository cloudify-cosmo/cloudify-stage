import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { request as requestHandler, forward } from 'handler/RequestHandler';
import type { Response } from 'express';

jest.mock('axios', () => jest.fn(() => 'responseMock'));

describe('RequestHandler', () => {
    it('allows to send an HTTP request', () => {
        const result = requestHandler('GET', 'http://test.url');
        expect(axios).toHaveBeenCalledWith('http://test.url', { method: 'GET' });
        expect(result).toEqual('responseMock');
    });

    it('allows to forward axios response', () => {
        const axiosResponse = {
            data: { pipe: jest.fn() },
            headers: { 'content-type': 'image/png' },
            status: 200,
            statusText: '',
            config: {} as any
        } as AxiosResponse;
        const expressResponse = {
            status: (_code: number) => expressResponse,
            set: jest.fn() as (_field: any) => Response
        } as Response;
        forward(axiosResponse, expressResponse);
        expect(expressResponse.set).toHaveBeenCalledWith(axiosResponse.headers);
        expect(axiosResponse.data.pipe).toHaveBeenCalledWith(expressResponse);
    });

    it('allows to block forwarding HTML content', () => {
        const axiosResponse = {
            data: { pipe: jest.fn() },
            headers: { 'content-type': 'text/html' },
            status: 200,
            statusText: '',
            config: {} as any
        } as AxiosResponse;
        const expressResponse = {
            status: jest.fn().mockReturnThis() as (_code: number) => Response,
            send: jest.fn().mockReturnThis() as (_body: any) => Response
        } as Response;
        forward(axiosResponse, expressResponse, { blockHtmlContent: true });
        expect(expressResponse.status).toHaveBeenCalledWith(403);
        expect(expressResponse.send).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
});
