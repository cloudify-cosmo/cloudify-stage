/**
 * Created by edenp on 7/20/17.
 */

import sinon from 'sinon';

import Cookies from 'js-cookie';
import Auth from 'utils/auth';

describe('(Utils) Auth', () => {
    afterAll(() => {
        sinon.restore(Cookies.get);
    });

    it('should check is logged in', () => {
        let managerData = {};
        expect(Auth.isLoggedIn(managerData)).toBe(false);

        managerData = { auth: {} };
        expect(Auth.isLoggedIn(managerData)).toBe(false);

        sinon.stub(Cookies, 'get', () => {
            return 'WyIwIiwiYWY4ODQ2YjFiNjZlZTlkNWIyZGNhNGU3MDY3Yjk3NTgiXQ.DFJJOw.zXZeFuhPJ-n-lds_UJsLTAub2Q0';
        });
        expect(Auth.isLoggedIn(managerData)).toBe(true);
    });
});
