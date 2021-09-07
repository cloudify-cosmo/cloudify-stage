// @ts-nocheck File not migrated fully to TS
import request from 'supertest';
import app from 'app';
import { mockDb } from 'db/Connection';

jest.mock('db/Connection');
jest.mock('handler/ManagerHandler');

describe('/ua endpoint', () => {
    it('allows to get user layout', () => {
        mockDb({
            UserApp: {
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
