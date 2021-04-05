const request = require('supertest');
const fs = require('fs-extra');
require('../mocks/passport');

jest.mock('fs-extra');
fs.writeJson.mockReturnValue(Promise.resolve());

const app = require('app');

describe('/templates endpoint', () => {
    it('allows to create a page', () => {
        const pageData = { layout: [{}] };
        return request(app)
            .post('/console/templates/pages')
            .send(pageData)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(fs.writeJson).toHaveBeenCalledWith(expect.any(String), expect.objectContaining(pageData), {
                    spaces: '  '
                });
            });
    });
});
