const _ = require('lodash');
const request = require('supertest');

function mockSamlConfig() {
    const samlConfig = {
        app: {
            saml: {
                enabled: true,
                ssoUrl: 'http://sso.url',
                portalUrl: 'http://portal.url',
                certPath: 'package.json'
            }
        }
    };
    jest.doMock('config', () => {
        const originalConfig = jest.requireActual('config').get();
        return {
            get: () => _.merge(originalConfig, samlConfig)
        };
    });
}

describe('/auth endpoint', () => {
    describe('/login handles', () => {
        beforeEach(() => {
            jest.resetModules();
        });

        it('valid token', () => {
            jest.doMock('handler/AuthHandler', () => ({
                getToken: () => Promise.resolve({ value: 'xyz', role: 'default' })
            }));
            return request(require('app'))
                .post('/console/auth/login')
                .expect(200)
                .then(response => {
                    expect(response.body).toStrictEqual({ role: 'default' });
                });
        });

        it('manager maintenance mode', () => {
            jest.doMock('handler/AuthHandler', () => ({
                getToken: () => Promise.reject({ error_code: 'maintenance_mode_active' })
            }));
            return request(require('app'))
                .post('/console/auth/login')
                .expect(423)
                .then(response => {
                    expect(response.body.message).toStrictEqual('Manager is currently in maintenance mode');
                });
        });

        it('invalid credentials', () => {
            jest.doMock('handler/AuthHandler', () => ({
                getToken: () => Promise.reject({ error_code: 'unauthorized_error' })
            }));
            return request(require('app'))
                .post('/console/auth/login')
                .expect(401)
                .then(response => {
                    expect(response.body.message).toStrictEqual('Invalid credentials');
                });
        });

        it('unknown errors', () => {
            jest.doMock('handler/AuthHandler', () => ({
                getToken: () => Promise.reject({ error_code: 'out_of_memory', message: 'No resources available' })
            }));
            return request(require('app'))
                .post('/console/auth/login')
                .expect(500)
                .then(response => {
                    expect(response.body.message).toStrictEqual(
                        'Failed to authenticate with manager: No resources available'
                    );
                });
        });
    });

    describe('/manager handles', () => {
        const mockAuthHandler = (edition, overrides = {}) =>
            jest.doMock('handler/AuthHandler', () => {
                const originalAuthHandler = jest.requireActual('handler/AuthHandler');
                return {
                    isProductLicensed: originalAuthHandler.isProductLicensed,
                    getManagerVersion: () => Promise.resolve({ version: '5.1.1', edition }),
                    getAndCacheConfig: () => Promise.resolve({ roles: [], permissions: {} }),
                    getLicense: () => Promise.resolve({ items: [{ license_edition: 'Shiny' }] }),
                    ...overrides
                };
            });

        beforeEach(() => {
            jest.resetModules();
            require('../mocks/passport');
        });

        it('licensed version', () => {
            mockAuthHandler('premium');
            return request(require('app'))
                .get('/console/auth/manager')
                .then(response => {
                    expect(response.body).toStrictEqual({
                        license: { license_edition: 'Shiny' },
                        version: { version: '5.1.1', edition: 'premium' },
                        rbac: { roles: [], permissions: {} }
                    });
                });
        });

        it('unlicensed version', () => {
            mockAuthHandler('community');
            return request(require('app'))
                .get('/console/auth/manager')
                .then(response => {
                    expect(response.body).toStrictEqual({
                        license: null,
                        version: { version: '5.1.1', edition: 'community' },
                        rbac: { roles: [], permissions: {} }
                    });
                });
        });

        it('error response', () => {
            mockAuthHandler('premium', {
                getManagerVersion: () => Promise.reject({ message: 'Cannot get manager version' })
            });
            return request(require('app'))
                .get('/console/auth/manager')
                .then(response => {
                    expect(response.body).toStrictEqual({
                        message: 'Failed to get manager data'
                    });
                });
        });

        it('clearing cookies when SAML is enabled', () => {
            mockAuthHandler('premium');
            mockSamlConfig();
            return request(require('app'))
                .get('/console/auth/manager')
                .then(response => {
                    const { 'set-cookie': setCookie } = response.headers;
                    expect(setCookie).toEqual([
                        'USERNAME=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                        'ROLE=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    ]);
                });
        });
    });

    describe('/saml/callback handles', () => {
        const mockAuthHandler = (
            getTokenViaSamlResponse = () => Promise.resolve({ value: 'token-content', role: 'sys_admin' })
        ) =>
            jest.doMock('handler/AuthHandler', () => ({
                getTokenViaSamlResponse
            }));

        beforeAll(() => {
            mockSamlConfig();
        });

        beforeEach(() => {
            jest.resetModules();
            require('../mocks/passport');
        });

        it('valid SAML response', () => {
            mockAuthHandler();
            return request(require('app'))
                .post('/console/auth/saml/callback')
                .send({ SAMLResponse: 'xyz' })
                .expect(302)
                .then(response => {
                    const { location, 'set-cookie': setCookie } = response.headers;
                    expect(location).toEqual('/console');
                    expect(setCookie).toEqual([
                        'XSRF-TOKEN=token-content; Path=/; SameSite=Strict',
                        'USERNAME=testuser; Path=/; SameSite=Strict',
                        'ROLE=sys_admin; Path=/; SameSite=Strict'
                    ]);
                });
        });

        it('invalid SAML response', () => {
            mockAuthHandler();
            return request(require('app'))
                .post('/console/auth/saml/callback')
                .send({})
                .expect(401)
                .then(response => {
                    expect(response.body).toStrictEqual({ message: 'Invalid Request' });
                });
        });

        it('invalid token', () => {
            mockAuthHandler(() => Promise.reject({ message: 'Token request invalid' }));
            return request(require('app'))
                .post('/console/auth/saml/callback')
                .send({ SAMLResponse: 'xyz' })
                .expect(500)
                .then(response => {
                    expect(response.body).toStrictEqual({
                        message: 'Failed to authenticate with manager'
                    });
                });
        });
    });
});
