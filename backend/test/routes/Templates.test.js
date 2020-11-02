const request = require('supertest');
const passport = require('passport');
const fs = require('fs-extra');

function authMock(req, res, next) {
    req.user = { username: 'testuser' };
    next();
}

jest.mock('passport');
passport.authenticate.mockReturnValue(authMock);
passport.initialize.mockReturnValue(authMock);

jest.mock('fs-extra');
fs.writeJson.mockReturnValue(Promise.resolve());

const app = require('app');

describe('/templates endpoint', () => {
    it('allows to create a page', () => {
        return new Promise(done => {
            const pageData = { layout: [{}] };
            request(app)
                .post('/console/templates/pages')
                .send(pageData)
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(fs.writeJson).toHaveBeenCalledWith(expect.any(String), expect.objectContaining(pageData), {
                        spaces: '  '
                    });
                    done();
                });
        });
    });
});
