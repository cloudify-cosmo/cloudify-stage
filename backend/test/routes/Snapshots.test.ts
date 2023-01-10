import request from 'supertest';
import app from 'app';
import { createTemplate, getUserTemplates } from 'handler/templates/TemplatesHandler';
import { omit, pick } from 'lodash';
import { createPage, getUserPages } from 'handler/templates/PagesHandler';
import type { Page, PageGroup, Template } from 'handler/templates/types';
import { createPageGroup, getUserPageGroups } from 'handler/templates/PageGroupsHandler';
import validateUniqueness from 'handler/widgets/validateUniqueness';
import installFiles from 'handler/widgets/installFiles';
import decompress from 'decompress';
import path from 'path';
import { importWidgetBackend } from 'handler/BackendHandler';
import mockDb from '../mockDb';
import type { PageGroupsSnapshot, PagesSnapshot, TemplatesSnapshot } from '../../routes/Snapshots';

jest.mock('db/Connection');
jest.mock('handler/templates/TemplatesHandler');
jest.mock('handler/templates/PagesHandler');
jest.mock('handler/templates/PageGroupsHandler');
jest.mock('handler/widgets/validateUniqueness');
jest.mock('handler/widgets/installFiles');
jest.mock('handler/BackendHandler');

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

    const templatesSnapshot: TemplatesSnapshot = [omit(template, 'name', 'custom')];

    it('allows to get snapshot data', () => {
        (<jest.Mock>getUserTemplates).mockReturnValue([template]);

        return request(app)
            .get('/console/snapshots/templates')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(templatesSnapshot);
            });
    });

    it('allows to restore snapshot data', () => {
        return request(app)
            .post('/console/snapshots/templates')
            .send(templatesSnapshot)
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

    const pagesSnapshot: PagesSnapshot = [omit(page, 'custom')];

    it('allows to get snapshot data', () => {
        (<jest.Mock>getUserPages).mockReturnValue([page]);

        return request(app)
            .get('/console/snapshots/pages')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(pagesSnapshot);
            });
    });

    it('allows to restore snapshot data', () => {
        return request(app)
            .post('/console/snapshots/pages')
            .send(pagesSnapshot)
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

describe('/snapshots/page-groups endpoint', () => {
    const pageGroup: PageGroup = {
        id: 'test',
        name: 'test',
        custom: true,
        pages: ['adminDash'],
        icon: 'rocket',
        updatedBy: 'user',
        updatedAt: '2022-06-01T18:30:57.450Z'
    };

    const pageGroupsSnapshot: PageGroupsSnapshot = [omit(pageGroup, 'custom')];

    it('allows to get snapshot data', () => {
        (<jest.Mock>getUserPageGroups).mockReturnValue([pageGroup]);

        return request(app)
            .get('/console/snapshots/page-groups')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(pageGroupsSnapshot);
            });
    });

    it('allows to restore snapshot data', () => {
        return request(app)
            .post('/console/snapshots/page-groups')
            .send(pageGroupsSnapshot)
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(createPageGroup).toHaveBeenCalledWith(
                    expect.objectContaining(pick(pageGroup, 'name', 'pages', 'icon')),
                    pageGroup.updatedBy,
                    pageGroup.updatedAt
                );
            });
    });
});

describe('/snapshots/widgets endpoint', () => {
    it('allows to get snapshot data', () => {
        return request(app)
            .get('/console/snapshots/widgets')
            .responseType('blob')
            .then(response => {
                expect(response.statusCode).toBe(200);
                return decompress(response.body);
            });
    });

    it('allows to restore snapshot data', () => {
        (<jest.Mock>validateUniqueness).mockResolvedValue(null);
        (<jest.Mock>importWidgetBackend).mockResolvedValue(null);
        (<jest.Mock>installFiles).mockResolvedValue(null);
        return request(app)
            .post('/console/snapshots/widgets')
            .attach('snapshot', path.join(__dirname, 'fixtures/snapshots/widgets.zip'))
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(validateUniqueness).toHaveBeenCalledTimes(2);
                expect(validateUniqueness).toHaveBeenCalledWith('testWidget');
                expect(validateUniqueness).toHaveBeenCalledWith('testWidgetBackend');
                expect(installFiles).toHaveBeenCalledTimes(2);
                expect(installFiles).toHaveBeenCalledWith('testWidget', expect.stringMatching('/testWidget$'));
                expect(installFiles).toHaveBeenCalledWith(
                    'testWidgetBackend',
                    expect.stringMatching('/testWidgetBackend')
                );
                expect(importWidgetBackend).toHaveBeenCalledTimes(2);
                expect(importWidgetBackend).toHaveBeenCalledWith('testWidget');
                expect(importWidgetBackend).toHaveBeenCalledWith('testWidgetBackend');
            });
    });
});
