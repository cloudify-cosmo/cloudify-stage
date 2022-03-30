import cookieStrategy from '../../auth/CookieStrategy';
import { TOKEN_COOKIE_NAME } from '../../consts';

describe('CookieStrategy', () => {
    it('should return new passport Strategy', () => {
        expect(cookieStrategy()).toEqual(
            expect.objectContaining({
                _cookieName: TOKEN_COOKIE_NAME,
                name: 'cookie'
            })
        );
    });
});
