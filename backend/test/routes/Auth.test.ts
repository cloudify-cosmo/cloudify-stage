import request from 'supertest';
import app from 'app';
import {
    getToken,
    getTokenViaSamlResponse,
    isProductLicensed,
    getManagerVersion,
    getAndCacheConfig,
    getLicense
} from 'handler/AuthHandler';
import { getConfig } from 'config';

jest.mock('handler/AuthHandler');
jest.mock('handler/ManagerHandler');
jest.mock('config', () => ({ getConfig: jest.fn(jest.requireActual('config').getConfig) }));

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
    (<jest.Mock>getConfig).mockReturnValue(samlConfig);
}

describe('/auth endpoint', () => {
    describe('/login handles', () => {
        it('valid token via https in CaaS environment', () => {
            (<jest.Mock>getToken).mockResolvedValue({ value: 'xyz', role: 'default' });
            return request(app)
                .post('/console/auth/login')
                .set('X-Force-Secure', 'true')
                .expect(200)
                .then(response => {
                    expect(response.body).toStrictEqual({ role: 'default' });
                    const { 'set-cookie': setCookie } = response.headers;
                    expect(setCookie).toEqual(['XSRF-TOKEN=xyz; Path=/; Secure; SameSite=Strict']);
                });
        });

        it('valid token via https in non-CaaS environment', () => {
            (<jest.Mock>getToken).mockResolvedValue({ value: 'xyz', role: 'default' });
            return request(app)
                .post('/console/auth/login')
                .set('X-Scheme', 'https')
                .expect(200)
                .then(response => {
                    expect(response.body).toStrictEqual({ role: 'default' });
                    const { 'set-cookie': setCookie } = response.headers;
                    expect(setCookie).toEqual(['XSRF-TOKEN=xyz; Path=/; Secure; SameSite=Strict']);
                });
        });

        it('valid token via http', () => {
            (<jest.Mock>getToken).mockResolvedValue({ value: 'xyz', role: 'default' });
            return request(app)
                .post('/console/auth/login')
                .expect(200)
                .then(response => {
                    expect(response.body).toStrictEqual({ role: 'default' });
                    const { 'set-cookie': setCookie } = response.headers;
                    expect(setCookie).toEqual(['XSRF-TOKEN=xyz; Path=/; SameSite=Strict']);
                });
        });

        it('manager maintenance mode', () => {
            (<jest.Mock>getToken).mockRejectedValue({ error_code: 'maintenance_mode_active' });
            return request(app)
                .post('/console/auth/login')
                .expect(423)
                .then(response => {
                    expect(response.body.message).toStrictEqual('Manager is currently in maintenance mode');
                });
        });

        it('invalid credentials', () => {
            (<jest.Mock>getToken).mockRejectedValue({ error_code: 'unauthorized_error' });
            return request(app)
                .post('/console/auth/login')
                .expect(401)
                .then(response => {
                    expect(response.body.message).toStrictEqual('Invalid credentials');
                });
        });

        it('unknown errors', () => {
            (<jest.Mock>getToken).mockRejectedValue({ error_code: 'out_of_memory', message: 'No resources available' });
            return request(app)
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
        const mockAuthHandler = (edition = {}) => {
            const originalAuthHandler = jest.requireActual('handler/AuthHandler');

            (<jest.Mock>isProductLicensed).mockImplementation(originalAuthHandler.isProductLicensed);
            (<jest.Mock>getManagerVersion).mockResolvedValue({ version: '5.1.1', edition });
            (<jest.Mock>getAndCacheConfig).mockResolvedValue({ roles: [], permissions: {} });
            (<jest.Mock>getLicense).mockResolvedValue({ items: [{ license_edition: 'Shiny' }] });
        };

        it('licensed version', () => {
            mockAuthHandler('premium');
            return request(app)
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
            return request(app)
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
            mockAuthHandler('premium');
            (<jest.Mock>getManagerVersion).mockRejectedValue({ message: 'Cannot get manager version' });
            return request(app)
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
            return request(app)
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
        beforeAll(() => {
            mockSamlConfig();
        });

        it('valid SAML response', () => {
            (<jest.Mock>getTokenViaSamlResponse).mockResolvedValue({ value: 'token-content', role: 'sys_admin' });
            return request(app)
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
            (<jest.Mock>getTokenViaSamlResponse).mockResolvedValue({ value: 'token-content', role: 'sys_admin' });
            return request(app)
                .post('/console/auth/saml/callback')
                .send({})
                .expect(401)
                .then(response => {
                    expect(response.body).toStrictEqual({ message: 'Invalid Request' });
                });
        });

        it('invalid token', () => {
            (<jest.Mock>getTokenViaSamlResponse).mockRejectedValue({ message: 'Token request invalid' });
            return request(app)
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
