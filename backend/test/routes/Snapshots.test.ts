import request from 'supertest';
import app from 'app';
import mockDb from '../mockDb';

jest.mock('db/Connection');

const userAppRow = {
    username: 'admin',
    appDataVersion: 7001,
    mode: 'main',
    appData: {},
    createdAt: '2022-06-01T18:30:57.450Z',
    updatedAt: '2022-12-27T15:25:52.460Z'
};

describe('/snapshots/ua endpoint', () => {
    it('allows to get snapshot data', () => {
        mockDb({
            UserApps: {
                findAll: () => Promise.resolve([userAppRow]),
                getAttributes: () => ({})
            }
        });

        return request(app)
            .get('/console/snapshots/ua')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual([userAppRow]);
            });
    });

    it('allows to restore snapshot data', () => {
        const create = jest.fn(() => Promise.resolve());
        const transaction = 'transaction';
        const tenant = 'default_tenant';

        mockDb({
            UserApps: {
                create
            },
            sequelize: {
                transaction: (f: any) => f(transaction)
            }
        });

        return request(app)
            .post('/console/snapshots/ua')
            .set('Tenant', tenant)
            .send([userAppRow])
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(create).toHaveBeenCalledWith({ ...userAppRow, tenant }, { transaction });
            });
    });
});
