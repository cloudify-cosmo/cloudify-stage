import request from 'supertest';
import app from 'app';
import mockDb from '../mockDb';

jest.mock('db/Connection');
jest.mock('handler/ManagerHandler');

const userAppRow = { username: 'test', appDataVersion: 600, mode: 'main', tenant: 'default_tenant', appData: {} };

describe('/ua endpoint', () => {
    it('allows to get user layout', () => {
        mockDb({
            UserApps: {
                findOne: () => Promise.resolve(userAppRow)
            }
        });

        return request(app)
            .get('/console/ua')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(userAppRow);
            });
    });
});

describe('/ua/clear-pages endpoint', () => {
    it('allows to clear pages', () => {
        const updateMock = jest.fn();
        mockDb({
            UserApps: {
                findOne: () =>
                    Promise.resolve({
                        ...userAppRow,
                        update: updateMock
                    })
            }
        });

        return request(app)
            .get('/console/ua/clear-pages')
            .then(response => {
                expect(response.status).toBe(200);
                expect(updateMock).toHaveBeenCalledWith({ appData: { pages: [] } });
            });
    });
});
