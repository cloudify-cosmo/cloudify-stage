import { getConfig } from 'config';
import validateAuthConfig from 'validateAuthConfig';
import 'app';

jest.mock('handler/ManagerHandler');
jest.mock('auth/SamlStrategy');

jest.mock('config', () => ({
    getConfig: () => {
        const config = jest.requireActual('config').getConfig();
        config.app.auth.type = 'saml';
        return config;
    }
}));

jest.mock('validateAuthConfig');

describe('App', () => {
    it('should validate auth config', () => {
        expect(validateAuthConfig).toHaveBeenCalledWith(getConfig().app.auth);
    });
});
