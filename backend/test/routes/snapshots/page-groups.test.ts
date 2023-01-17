import { omit, pick } from 'lodash';
import request from 'supertest';
import type { PageGroup } from 'handler/templates/types';
import type { PageGroupsSnapshot } from 'routes/Snapshots';
import { createPageGroup, getUserPageGroups } from 'handler/templates/PageGroupsHandler';
import app from 'app';

jest.mock('handler/templates/PageGroupsHandler');
jest.mock('handler/AuthHandler', () => ({
    isAuthorized: () => true,
    getRBAC: () => Promise.resolve({ permissions: {} })
}));

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
