import type { Template } from 'handler/templates/types';
import type { TemplatesSnapshot } from 'routes/Snapshots';
import { omit } from 'lodash';
import { createTemplate, getUserTemplates } from 'handler/templates/TemplatesHandler';
import request from 'supertest';
import app from 'app';

jest.mock('handler/templates/TemplatesHandler');
jest.mock('handler/AuthHandler');

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
