import { getConfig } from 'config';
import validateSamlConfig from 'samlSetup';
import 'app';

jest.mock('handler/ManagerHandler');
jest.mock('auth/SamlStrategy');

jest.mock('config', () => ({
    getConfig: () => {
        const config = jest.requireActual('config').getConfig();
        config.app.saml.enabled = true;
        return config;
    }
}));

jest.mock('samlSetup');

describe('App', () => {
    it('should validate SAML config', () => {
        expect(validateSamlConfig).toHaveBeenCalledWith(getConfig().app.saml);
    });
});
