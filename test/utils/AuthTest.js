/**
 * Created by edenp on 7/20/17.
 */
'use strict';

import chai from 'chai';
chai.use(require('chai-as-promised'));
chai.should();
var expect = chai.expect;
import sinon from 'sinon';

import Auth from '../../app/utils/auth';
import Cookies from 'js-cookie';

describe('(Utils) Auth', () => {
    after(() => {
        sinon.restore(Cookies.get);
    });

    it('should check is logged in', () => {
        var managerData = {};
        expect(Auth.isLoggedIn(managerData)).to.equal(false);

        managerData = {auth:{}};
        expect(Auth.isLoggedIn(managerData)).to.equal(false);

        sinon.stub(Cookies, 'get', () => {
            return 'WyIwIiwiYWY4ODQ2YjFiNjZlZTlkNWIyZGNhNGU3MDY3Yjk3NTgiXQ.DFJJOw.zXZeFuhPJ-n-lds_UJsLTAub2Q0'
        });
        expect(Auth.isLoggedIn(managerData)).to.equal(true);
    });
});