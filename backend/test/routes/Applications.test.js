const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/applications endpoint', () => {
    it('allows to get all data about applications', () => {
        mockDb({
            Application: {
                findAll: () =>
                    Promise.resolve([
                        { id: 1, name: 'A' },
                        { id: 2, name: 'B' }
                    ])
            }
        });
        const app = require('app');

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
