const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/clientConfig endpoint', () => {
    it('allows to get client config', () => {
        mockDb({
            ClientConfig: {
                findOrCreate: jest.fn(() =>
                    Promise.resolve([
                        {
                            managerIp: 'localhost',
                            config: { str: 'value', int: 5 }
                        }
                    ])
                )
            }
        });
        const app = require('app');

        return new Promise(done => {
            request(app)
                .get('/console/clientConfig')
                .then(response => {
                    expect(response.type).toContain('json');
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toStrictEqual({
                        managerIp: 'localhost',
                        config: { str: 'value', int: 5 }
                    });
                    done();
                });
        });
    });
});
