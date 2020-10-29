const _ = require('lodash');
const request = require('supertest');
const app = require('app');
const appConfig = require('conf/app.json');
const userConfig = require('conf/userConfig.json');

describe('/config endpoint', () => {
    it('allows to get client config', () => {
        return new Promise(done => {
            request(app)
                .get('/console/config')
                .then(response => {
                    expect(response.type).toContain('json');
                    expect(response.statusCode).toBe(200);
                    const expectedResponse = {
                        app: {
                            whiteLabel: userConfig.whiteLabel,
                            maps: userConfig.maps,
                            maintenancePollingInterval: appConfig.maintenancePollingInterval,
                            singleManager: appConfig.singleManager,
                            saml: _.omit(appConfig.saml, 'certPath')
                        },
                        manager: {
                            ip: expect.any(String)
                        }
                    };
                    expect(response.body).toStrictEqual(expectedResponse);
                    done();
                });
        });
    });
});
