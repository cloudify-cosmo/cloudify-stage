const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/ba endpoint', () => {
    it('allows to get blueprint image', () => {
        mockDb({
            BlueprintAdditions: {
                findOne: () => Promise.resolve({ blueprintId: 1, image: null, imageUrl: 'http://test.url/image1.png' })
            }
        });
        const app = require('app');

        return request(app)
            .get('/console/ba/image/1')
            .then(response => {
                expect(response.statusCode).toBe(302);
                expect(response.text).toEqual('Found. Redirecting to http://test.url/image1.png');
            });
    });
});
