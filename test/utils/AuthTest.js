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

describe('(Utils) Auth', () => {

    describe('#Login', () => {

        before(() => {
            sinon.stub(Auth, '_getApiVersion', () =>{
                return Promise.resolve({apiVersion: 'v3.1', serverVersion: '4.1.0'});
            });
            sinon.stub(Auth, '_getLoginToken', () =>{
                return Promise.resolve({
                    apiVersion: 'v3.1',
                    role:'admin',
                    serverVersion:'4.1.0',
                    token:'WyIwIiwiYWY4ODQ2YjFiNjZlZTlkNWIyZGNhNGU3MDY3Yjk3NTgiXQ.DFJJOw.zXZeFuhPJ-n-lds_UJsLTAub2Q0'
                })
            });
            sinon.stub(Auth, '_getTenants', () =>{
                return Promise.resolve(
                    {
                        tenants: {
                            items: [
                                {
                                    groups: 0,
                                    name: 'default_tenant',
                                    users: 1
                                }
                            ]
                        }
                    }
                );
            });
        });

        after(() => {
            sinon.restore(Auth._getApiVersion);
            sinon.restore(Auth._getLoginToken);
            sinon.restore(Auth._getTenants);
        });

        it('should login', () => {
            return Auth.login().should.eventually.deep.equal({
                    token: 'WyIwIiwiYWY4ODQ2YjFiNjZlZTlkNWIyZGNhNGU3MDY3Yjk3NTgiXQ.DFJJOw.zXZeFuhPJ-n-lds_UJsLTAub2Q0',
                    apiVersion: 'v3.1',
                    serverVersion: '4.1.0',
                    role: 'admin',
                    tenants: {
                        items: [
                            {
                                groups: 0,
                                name: 'default_tenant',
                                users: 1
                            }
                        ]
                    }
                });
        });

        it('should not login', () => {
            var err = 'general error';
            sinon.restore(Auth._getTenants);
            sinon.stub(Auth, '_getTenants', () =>{
                return Promise.reject(err);
            });

            return Auth.login().should.be.rejectedWith(err);
        });

        it('should show "no tenant" error', () => {
            sinon.restore(Auth._getTenants);
            sinon.stub(Auth, '_getTenants', () =>{
                return Promise.resolve(
                    {
                        tenants: {
                            items: []
                        }
                    }
                );
            });

            return Auth.login().should.be.rejectedWith('User has no tenants');
         });
    });

    it('should check is logged in', () => {
        var managerData = {};
        expect(Auth.isLoggedIn(managerData)).to.equal(false);

        var managerData = {auth:{}};
        expect(Auth.isLoggedIn(managerData)).to.equal(false);

        var managerData = {auth:{token:'imatoken'}};
        expect(Auth.isLoggedIn(managerData)).to.equal(true);
    });
});