// @ts-nocheck File not migrated fully to TS
import request from 'supertest';
import app from 'app';
import { mockDb } from 'db/Connection';

jest.mock('handler/ManagerHandler');
jest.mock('db/Connection');

describe('/bud endpoint', () => {
    it('allows to get layout for a blueprint', () => {
        mockDb({
            BlueprintUserData: {
                findOne: () => Promise.resolve({ blueprintId: 1, username: 'test', layout: {} })
            }
        });

        return request(app)
            .get('/console/bud/layout/1')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({});
            });
    });
});
