const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/ua endpoint', () => {
    it('allows to get user layout', () => {
        mockDb({
            UserApp: {
                findOne: jest.fn(() =>
                    Promise.resolve({
                        managerIp: 'localhost',
                        username: 'test',
                        appDataVersion: 4,
                        mode: 'main',
                        tenant: 'default_tenant',
                        appData: {}
                    })
                )
            }
        });
        const app = require('app');

        return new Promise(done => {
            request(app)
                .get('/console/ua')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toStrictEqual({
                        managerIp: 'localhost',
                        username: 'test',
                        appDataVersion: 4,
                        mode: 'main',
                        tenant: 'default_tenant',
                        appData: {}
                    });
                    done();
                });
        });
    });
});
