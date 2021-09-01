// @ts-nocheck File not migrated fully to TS
import request from 'supertest';
import { mockDb } from 'db/Connection';
import app from 'app';

jest.mock('handler/ManagerHandler');
jest.mock('db/Connection');

describe('/ba endpoint', () => {
    it('allows to get blueprint image', () => {
        mockDb({
            BlueprintAdditions: {
                findOne: () => Promise.resolve({ blueprintId: 1, image: null, imageUrl: 'http://test.url/image1.png' })
            }
        });

        return request(app)
            .get('/console/ba/image/1')
            .then(response => {
                expect(response.statusCode).toBe(302);
                expect(response.text).toEqual('Found. Redirecting to http://test.url/image1.png');
            });
    });
});
