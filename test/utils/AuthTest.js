/**
 * Created by edenp on 7/20/17.
 */

import chai from 'chai';
import sinon from 'sinon';

import Cookies from 'js-cookie';
import Auth from '../../app/utils/auth';

chai.use(require('chai-as-promised'));

chai.should();
const { expect } = chai;

describe('(Utils) Auth', () => {
    after(() => {
        sinon.restore(Cookies.get);
    });

    it('should check is logged in', () => {
        let managerData = {};
        expect(Auth.isLoggedIn(managerData)).to.equal(false);

        managerData = { auth: {} };
        expect(Auth.isLoggedIn(managerData)).to.equal(false);

        sinon.stub(Cookies, 'get', () => {
            return 'WyIwIiwiYWY4ODQ2YjFiNjZlZTlkNWIyZGNhNGU3MDY3Yjk3NTgiXQ.DFJJOw.zXZeFuhPJ-n-lds_UJsLTAub2Q0';
        });
        expect(Auth.isLoggedIn(managerData)).to.equal(true);
    });
});
