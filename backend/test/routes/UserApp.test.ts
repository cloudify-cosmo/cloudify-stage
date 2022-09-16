import request from 'supertest';
import app from 'app';
import mockDb from '../mockDb';

jest.mock('db/Connection');
jest.mock('handler/ManagerHandler');

describe('/ua endpoint', () => {
    it('allows to get user layout', () => {
        mockDb({
            UserApps: {
                findOne: () =>
                    Promise.resolve({
                        username: 'test',
                        appDataVersion: 600,
                        mode: 'main',
                        tenant: 'default_tenant',
                        appData: {}
                    })
            }
        });

        return request(app)
            .get('/console/ua')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({
                    username: 'test',
                    appDataVersion: 600,
                    mode: 'main',
                    tenant: 'default_tenant',
                    appData: {}
                });
            });
    });
});
