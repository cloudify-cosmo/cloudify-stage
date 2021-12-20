import request from 'supertest';
import app from 'app';
import mockRequest from 'request';
import type { Response } from 'request';
import type { Response as ExpressReponse } from 'express';

jest.mock('handler/ManagerHandler');

jest.mock('request', () => {
    const mock = jest.fn(() => {
        const response: Partial<Response> = {
            headers: {
                'content-type': 'image/png',
                'content-disposition': 'attachment',
                'last-modified': 'Thu, 21 Jan 2021 12:57:29 GMT',
                etag: '7287cb1c-338d-ea0c-4dba-bcbc58e0a899-0',
                date: 'Tue, 26 Jan 2021 13:44:00 GMT',
                'stadia-tileserver': 'lon-tileserver-g10-orlui',
                'content-length': '0',
                'cache-control': 'max-age=21600',
                'stadia-cache': 'HIT',
                'accept-ranges': 'bytes',
                'stadia-entrypoint': 'fra-pop-roque-sauvm',
                'stadia-billable': '1',
                'stadia-property': '3859',
                'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
                'x-robots-tag': 'noindex',
                connection: 'close'
            }
        };
        const proxiedRequest = {
            on(event: string, callback: (...args: any[]) => void) {
                if (event === 'response') {
                    callback(response);
                }

                return proxiedRequest;
            },

            pipe(destination: ExpressReponse) {
                destination.writeHead(200, response.headers);
                destination.end();

                return destination;
            },
            end() {},
            once() {},
            emit() {}
        };

        return proxiedRequest;
    });

    // @ts-ignore TODO(RD-382) It will be removed, so no need to provide typing
    mock.defaults = () => mock;

    return mock;
});

describe('/maps endpoint', () => {
    it('forwards requests to stadia and removes the HSTS header', () => {
        return request(app)
            .get('/console/maps/0/0/0/?noCache=1611669199559')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['strict-transport-security']).toBe(undefined);

                expect(mockRequest).toHaveBeenCalledTimes(1);
                const proxiedUrl = (<jest.Mock>(<unknown>mockRequest)).mock.calls[0][0];
                expect(proxiedUrl).toEqual(expect.stringContaining('stadiamaps.com'));
            });
    });
});
