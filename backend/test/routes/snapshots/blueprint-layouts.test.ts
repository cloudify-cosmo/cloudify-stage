import request from 'supertest';
import app from 'app';
import mockDb from '../../mockDb';

jest.mock('db/Connection');
jest.mock('handler/AuthHandler', () => ({
    isAuthorized: () => true,
    getRBAC: () => Promise.resolve({ permissions: {} })
}));

describe('/snapshots/blueprint-layouts endpoint', () => {
    const blueprintUserDataRow = {
        blueprintId: 'new',
        username: 'admin',
        layout: {},
        createdAt: '2022-06-01T18:30:57.450Z',
        updatedAt: '2022-12-27T15:25:52.460Z'
    };

    it('allows to get snapshot data', () => {
        mockDb({
            BlueprintUserData: {
                findAll: () => Promise.resolve([blueprintUserDataRow]),
                getAttributes: () => ({})
            }
        });

        return request(app)
            .get('/console/snapshots/blueprint-layouts')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual([blueprintUserDataRow]);
            });
    });

    it('allows to restore snapshot data', () => {
        const create = jest.fn(() => Promise.resolve());
        const transaction = 'transaction';

        mockDb({
            BlueprintUserData: {
                create
            },
            sequelize: {
                transaction: (f: any) => f(transaction)
            }
        });

        return request(app)
            .post('/console/snapshots/blueprint-layouts')
            .send([blueprintUserDataRow])
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(create).toHaveBeenCalledWith(blueprintUserDataRow, { transaction });
            });
    });
});
