import { readdirSync, readJsonSync } from 'fs-extra';

import * as PageGroupsHandler from 'handler/templates/PageGroupsHandler';

jest.mock('fs-extra');
(<jest.Mock>readdirSync).mockReturnValue(['group1.json', 'group2.json']);
const file1Content = 'file1Content';
(<jest.Mock>readJsonSync).mockReturnValueOnce(file1Content);
(<jest.Mock>readJsonSync).mockImplementationOnce(() => {
    throw Error();
});

describe('PageGroupsHandler', () => {
    it('should list page groups', () => {
        const result = PageGroupsHandler.listPageGroups();
        expect(result).toEqual([
            { id: 'group1', custom: false },
            { id: 'group2', custom: false }
        ]);
    });
});
