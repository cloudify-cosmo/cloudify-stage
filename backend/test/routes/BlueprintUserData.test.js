const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/bud endpoint', () => {
    it('allows to get layout for a blueprint', () => {
        mockDb({
            BlueprintUserData: {
                findOne: () => Promise.resolve({ blueprintId: 1, username: 'test', layout: {} })
            }
        });
        const app = require('app');

        return new Promise(done => {
            request(app)
                .get('/console/bud/layout/1')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toEqual({});
                    done();
                });
        });
    });
});
