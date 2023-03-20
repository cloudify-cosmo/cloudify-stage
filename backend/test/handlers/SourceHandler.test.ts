import { statSync, readdirSync } from 'fs-extra';
import { saveDataFromUrl, removeOldExtracts, decompressArchive } from 'handler/ArchiveHelper';
import { browseArchiveTree } from 'handler/SourceHandler';

jest.mock('handler/ArchiveHelper');
(<jest.Mock>saveDataFromUrl).mockResolvedValue({ archiveFolder: '', archiveFile: '' });
(<jest.Mock>removeOldExtracts).mockResolvedValue(undefined);
(<jest.Mock>decompressArchive).mockResolvedValue(undefined);

jest.mock('fs-extra');
(<jest.Mock>statSync).mockReturnValueOnce({
    isSymbolicLink: () => false,
    isFile: () => false,
    isDirectory: () => true
});
(<jest.Mock>readdirSync).mockReturnValueOnce(['subdir']);
(<jest.Mock>statSync).mockReturnValueOnce({
    isSymbolicLink: () => false,
    isFile: () => false,
    isDirectory: () => true
});
(<jest.Mock>readdirSync).mockReturnValueOnce(['fileNameSpecial?#Characters']);
(<jest.Mock>statSync).mockReturnValueOnce({ isSymbolicLink: () => false, isFile: () => true });

describe('SourceHandler', () => {
    it('generates archive tree', () => {
        // @ts-ignore Passing mocked request
        return browseArchiveTree({ params: {} }).then(archiveTree => {
            expect(archiveTree).not.toBeNull();
            expect(archiveTree && archiveTree?.children?.[0].isDir).toBeTruthy();
            expect(
                archiveTree && archiveTree?.children?.[0].isDir && archiveTree?.children?.[0]?.children?.[0].key
            ).toEqual('subdir/fileNameSpecial%3F%23Characters');
        });
    });
});
