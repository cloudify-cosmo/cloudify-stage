import { readdirSync, readJsonSync } from 'fs-extra';

import * as PageGroupsHandler from 'handler/templates/PageGroupsHandler';

jest.mock('fs-extra');
(<jest.Mock>readdirSync).mockReturnValueOnce(['group1.json', 'group2.json']);
(<jest.Mock>readdirSync).mockReturnValueOnce(['group3.json']);
const file1Content = { name: 'Group 1' };
(<jest.Mock>readJsonSync).mockReturnValueOnce(file1Content);
(<jest.Mock>readJsonSync).mockImplementationOnce(() => {
    throw Error();
});
const file3Content = { name: 'Group 3', updatedBy: 'admin', updatedAt: 'recently' };
(<jest.Mock>readJsonSync).mockReturnValueOnce(file3Content);

describe('PageGroupsHandler', () => {
    it('should list page groups', () => {
        const result = PageGroupsHandler.listPageGroups();
        expect(result).toEqual([
            { id: 'group1', name: 'Group 1', updatedAt: '', updatedBy: 'Manager', custom: false },
            { id: 'group3', name: 'Group 3', updatedAt: 'recently', updatedBy: 'admin', custom: true }
        ]);
    });
});
