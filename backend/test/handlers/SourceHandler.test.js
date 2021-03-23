const fs = require('fs-extra');
const archiveHelper = require('../../handler/ArchiveHelper');

jest.mock('../../handler/ArchiveHelper');
archiveHelper.saveDataFromUrl.mockResolvedValue({ archiveFolder: '', archiveFile: '' });
archiveHelper.removeOldExtracts.mockResolvedValue();
archiveHelper.decompressArchive.mockResolvedValue();

jest.mock('fs-extra');
fs.statSync.mockReturnValueOnce({ isSymbolicLink: () => false, isFile: () => false, isDirectory: () => true });
fs.readdirSync.mockReturnValueOnce(['subdir']);
fs.statSync.mockReturnValueOnce({ isSymbolicLink: () => false, isFile: () => false, isDirectory: () => true });
fs.readdirSync.mockReturnValueOnce(['fileNameSpecial?#Characters']);
fs.statSync.mockReturnValueOnce({ isSymbolicLink: () => false, isFile: () => true });

describe('SourceHandler', () => {
    const sourceHandler = require('../../handler/SourceHandler');

    it('generates archive tree', () => {
        return sourceHandler
            .browseArchiveTree({ params: {} })
            .then(archiveTree =>
                expect(archiveTree.children[0].children[0].key).toEqual('subdir/fileNameSpecial%3F%23Characters')
            );
    });
});
