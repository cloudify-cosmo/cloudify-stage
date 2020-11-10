const passport = require('passport');

function authMock(req, res, next) {
    req.user = { username: 'testuser' };
    next();
}

jest.mock('passport');
passport.authenticate.mockReturnValue(authMock);
passport.initialize.mockReturnValue(authMock);
