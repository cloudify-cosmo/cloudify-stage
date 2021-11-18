// @ts-nocheck File not migrated fully to TS
import request from 'supertest';
import app from 'app';
import { mockDb } from 'db/Connection';

jest.mock('db/Connection');
jest.mock('handler/ManagerHandler');

describe('/clientConfig endpoint', () => {
    it('allows to get client config', () => {
        mockDb({
            ClientConfigs: {
                findOrCreate: () =>
                    Promise.resolve([
                        {
                            managerIp: 'localhost',
                            config: { str: 'value', int: 5 }
                        }
                    ])
            }
        });

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
