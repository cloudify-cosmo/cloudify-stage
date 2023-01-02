import request from 'supertest';
import app from 'app';
import { createTemplate, getUserTemplates } from 'handler/templates/TemplatesHandler';
import { omit, pick } from 'lodash';
import { createPage, getUserPages } from 'handler/templates/PagesHandler';
import type { Page, Template } from 'handler/templates/types';
import mockDb from '../mockDb';

jest.mock('db/Connection');
jest.mock('handler/templates/TemplatesHandler');
jest.mock('handler/templates/PagesHandler');

describe('/snapshots/ua endpoint', () => {
    const userAppRow = {
        username: 'admin',
        appDataVersion: 7001,
        mode: 'main',
        appData: {},
        createdAt: '2022-06-01T18:30:57.450Z',
        updatedAt: '2022-12-27T15:25:52.460Z'
    };

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

    it('responds with 400 on data conflict', () => {
        mockDb({
            sequelize: {
                transaction: () => Promise.reject({ name: 'SequelizeUniqueConstraintError' })
            }
        });

        return request(app)
            .post('/console/snapshots/ua')
            .send([])
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
});

describe('/snapshots/templates endpoint', () => {
    const template: Template = {
        id: 'test',
        name: 'test',
        custom: true,
        data: {
            pages: [],
            roles: [],
            tenants: []
        },
        updatedBy: 'user',
        updatedAt: '2022-06-01T18:30:57.450Z'
    };

    it('allows to get snapshot data', () => {
        (<jest.Mock>getUserTemplates).mockReturnValue([template]);

        return request(app)
            .get('/console/snapshots/templates')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual([omit(template, 'name', 'custom')]);
            });
    });

    it('allows to restore snapshot data', () => {
        return request(app)
            .post('/console/snapshots/templates')
            .send([omit(template, 'name', 'custom')])
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(createTemplate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        data: expect.objectContaining(omit(template.data, 'pages')),
                        pages: template.data.pages
                    }),
                    template.updatedBy,
                    template.updatedAt
                );
            });
    });
});

describe('/snapshots/pages endpoint', () => {
    const page: Page = {
        id: 'test',
        name: 'test',
        custom: true,
        data: {
            icon: '',
            layout: []
        },
        updatedBy: 'user',
        updatedAt: '2022-06-01T18:30:57.450Z'
    };

    it('allows to get snapshot data', () => {
        (<jest.Mock>getUserPages).mockReturnValue([page]);

        return request(app)
            .get('/console/snapshots/pages')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual([omit(page, 'custom')]);
            });
    });

    it('allows to restore snapshot data', () => {
        return request(app)
            .post('/console/snapshots/pages')
            .send([omit(page, 'custom')])
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(createPage).toHaveBeenCalledWith(
                    expect.objectContaining({
                        ...pick(page, 'id', 'name'),
                        ...page.data
                    }),
                    page.updatedBy,
                    page.updatedAt
                );
            });
    });
});
