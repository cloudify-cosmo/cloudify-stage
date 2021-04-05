const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/clientConfig endpoint', () => {
    it('allows to get client config', () => {
        mockDb({
            ClientConfig: {
                findOrCreate: () =>
                    Promise.resolve([
                        {
                            managerIp: 'localhost',
                            config: { str: 'value', int: 5 }
                        }
                    ])
            }
        });
        const app = require('app');

        return request(app)
            .get('/console/clientConfig')
            .then(response => {
                expect(response.type).toContain('json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({
                    managerIp: 'localhost',
                    config: { str: 'value', int: 5 }
                });
            });
    });
});
