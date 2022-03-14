import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { request as requestHandler, forward } from 'handler/RequestHandler';
import { Response } from 'express';

jest.mock('axios', () => jest.fn(() => 'responseMock'));

describe('RequestHandler', () => {
    it('allows to send an HTTP request', () => {
        const result = requestHandler('GET', 'http://test.url');
        expect(axios).toHaveBeenCalledWith('http://test.url', { method: 'GET' });
        expect(result).toEqual('responseMock');
    });

    it('allows to forward axios response', () => {
        const axiosResponse = { data: { pipe: jest.fn() } } as AxiosResponse;
        const expressResponse = {
            status: (_code: number) => expressResponse,
            set: jest.fn() as (_field: any) => Response
        } as Response;
        forward(axiosResponse, expressResponse);
        expect(expressResponse.set).toHaveBeenCalledWith(axiosResponse.headers);
        expect(axiosResponse.data.pipe).toHaveBeenCalledWith(expressResponse);
    });
});
