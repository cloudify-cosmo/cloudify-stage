import pathlib from 'path';
import { readdirSync, readJsonSync, writeJson } from 'fs-extra';

import * as PageGroupsHandler from 'handler/templates/PageGroupsHandler';
import { userTemplatesFolder } from 'handler/templates/TemplatesHandler';

jest.mock('fs-extra');

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
        Date.now = jest.fn(() => 1487076708000);

        PageGroupsHandler.createPageGroup('admin', { id: 'pg' });

        expect(writeJson).toHaveBeenCalledWith(
            pathlib.resolve(userTemplatesFolder, 'page-groups', 'pg.json'),
            { updatedAt: '2017-02-14T13:51:48+01:00', updatedBy: 'admin' },
            { spaces: '  ' }
        );
    });
});
