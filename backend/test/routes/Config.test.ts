import _ from 'lodash';
import request from 'supertest';
import app from 'app';
import appConfig from '../../../conf/config.json';
import userConfig from '../../../conf/userConfig.json';

jest.mock('handler/ManagerHandler');

describe('/config endpoint', () => {
    it('allows to get config', () =>
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
                        auth: _.omit(userConfig.auth, 'certPath')
                    },
                    manager: {
                        ip: expect.any(String)
                    }
                };
                expect(response.body).toStrictEqual(expectedResponse);
            }));
});
