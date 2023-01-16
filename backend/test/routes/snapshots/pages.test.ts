import type { Page } from 'handler/templates/types';
import type { PagesSnapshot } from 'routes/Snapshots';
import { omit, pick } from 'lodash';
import { createPage, getUserPages } from 'handler/templates/PagesHandler';
import request from 'supertest';
import app from 'app';

jest.mock('handler/templates/PagesHandler');

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
