import { getRBAC } from 'handler/AuthHandler';
import { jsonRequest } from 'handler/ManagerHandler';
import { getAuthenticationTokenHeaderFromToken } from '../../utils';

jest.mock('handler/ManagerHandler');
const config = { authorization: {} };
(<jest.Mock>jsonRequest).mockResolvedValue(config);

describe('AuthHandler', () => {
    it('should get RBAC', async () => {
        const token = 'token';
        const result = await getRBAC(token);
        expect(result).toBe(config.authorization);
        expect(jsonRequest).toHaveBeenCalledWith('GET', '/config', getAuthenticationTokenHeaderFromToken(token));
    });
});
