const request = require('supertest');
const app = require('app');

jest.mock('handler/AuthHandler', () => ({
    getToken: () => Promise.reject({ error_code: 'maintenance_mode_active' })
}));

describe('/auth endpoint', () => {
    it('handles manager maintenance mode', () => {
        return new Promise(done => {
            request(app)
                .post('/console/auth/login')
                .then(response => {
                    expect(response.body.message).toStrictEqual('Manager is currently in maintenance mode');
                    done();
                });
        });
    });
});
