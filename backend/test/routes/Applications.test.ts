// @ts-nocheck File not migrated fully to TS

import request from 'supertest';
import app from 'app';
import { mockDb } from 'db/Connection';

jest.mock('handler/ManagerHandler');
jest.mock('db/Connection');

describe('/applications endpoint', () => {
    it('allows to get all data about applications', () => {
        mockDb({
            Applications: {
                findAll: () =>
                    Promise.resolve([
                        { id: 1, name: 'A' },
                        { id: 2, name: 'B' }
                    ])
            }
        });

        return request(app)
            .get('/console/applications')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual([
                    { id: 1, name: 'A' },
                    { id: 2, name: 'B' }
                ]);
            });
    });
});
