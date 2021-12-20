import nock from 'nock';
import { jsonRequest } from 'handler/ManagerHandler';

jest.mock('config', () => ({
    getConfig: () => {
        const config = jest.requireActual('config').getConfig();
        config.manager.ip = 'localhost';
        return config;
    }
}));

const endpoint = 'status';

describe('ManagerHandler', () => {
    it('handles JSON responses', () => {
        const payload = { result: 'ok' };

        nock(/localhost/)
            .get(`/api/v3.1/${endpoint}`)
            .reply(200, payload);

        return jsonRequest('get', endpoint, {}, undefined, undefined).then(json => {
            expect(json).toEqual(payload);
        });
    });

    it('throws error for non-JSON responses', () => {
        const payload = 'non-json-payload';

        nock(/localhost/)
            .get(`/api/v3.1/${endpoint}`)
            .reply(200, payload);

        return jsonRequest('get', endpoint, {}, undefined, undefined).catch(error =>
            expect(error).toEqual(
                'response data could not be parsed to JSON: SyntaxError: Unexpected token o in JSON at position 1'
            )
        );
    });
});
