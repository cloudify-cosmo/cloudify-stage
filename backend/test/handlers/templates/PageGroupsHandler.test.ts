import pathlib from 'path';
import { readdirSync, readJsonSync, writeJson } from 'fs-extra';

import * as PageGroupsHandler from 'handler/templates/PageGroupsHandler';
import { userTemplatesFolder } from 'handler/templates/TemplatesHandler';

jest.mock('fs-extra');
jest.mock('moment', () => {
    const momentMock = () => ({ format: () => 'timestamp' });
    momentMock.version = '2.6.0';
    momentMock.fn = {};
    return momentMock;
});

describe('PageGroupsHandler', () => {
    it('should list page groups', () => {
        (<jest.Mock>readdirSync).mockReturnValueOnce(['group1.json', 'group2.json']);
        (<jest.Mock>readdirSync).mockReturnValueOnce(['group3.json']);
        const file1Content = { name: 'Group 1' };
        (<jest.Mock>readJsonSync).mockReturnValueOnce(file1Content);
        (<jest.Mock>readJsonSync).mockImplementationOnce(() => {
            throw Error();
        });
        const file3Content = { name: 'Group 3', updatedBy: 'admin', updatedAt: 'recently' };
        (<jest.Mock>readJsonSync).mockReturnValueOnce(file3Content);

        const result = PageGroupsHandler.listPageGroups();

        expect(result).toEqual([
            { id: 'group1', name: 'Group 1', updatedAt: '', updatedBy: 'Manager', custom: false },
            { id: 'group3', name: 'Group 3', updatedAt: 'recently', updatedBy: 'admin', custom: true }
        ]);
    });

    it('should create page group', () => {
        PageGroupsHandler.validateAndCreatePageGroup('admin', { id: 'pg', name: 'pg', icon: 'stop', pages: [] });

        expect(writeJson).toHaveBeenCalledWith(
            pathlib.resolve(userTemplatesFolder, 'page-groups', 'pg.json'),
            { name: 'pg', icon: 'stop', pages: [], updatedAt: 'timestamp', updatedBy: 'admin' },
            { spaces: '  ' }
        );
    });
});
