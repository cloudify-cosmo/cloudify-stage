const request = require('supertest');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const archiveHelper = require('../../handler/ArchiveHelper');
require('../mocks/passport');

jest.mock('../../handler/ArchiveHelper');
archiveHelper.saveDataFromUrl.mockResolvedValue({ archiveFolder: '', archiveFile: '' });
archiveHelper.removeOldExtracts.mockResolvedValue();
archiveHelper.decompressArchive.mockResolvedValue();

jest.mock('fs-extra');
fs.existsSync.mockReturnValue(false);
fs.statSync.mockReturnValue({ isSymbolicLink: () => true });
const fileContent = 'fileContent';
fs.readFile.mockResolvedValue(fileContent);

describe('/source endpoint', () => {
    it('allows to get blueprint file', () => {
        const app = require('app');
        return request(app)
            .get('/console/source/browse/blueprintId/file/timestamp/path/to/file')
            .then(response => {
                const blueprintDir = path.join(os.tmpdir(), 'cloudifyBrowseSources', 'blueprintIdtimestamp');
                const absoluteFilePath = path.join(blueprintDir, 'extracted', 'path', 'to', 'file');
                expect(fs.existsSync).toHaveBeenCalledWith(absoluteFilePath);
                expect(archiveHelper.removeOldExtracts).toHaveBeenCalled();
                expect(archiveHelper.saveDataFromUrl).toHaveBeenCalledWith(
                    '/blueprints/blueprintId/archive',
                    blueprintDir,
                    expect.anything()
                );
                expect(archiveHelper.decompressArchive).toHaveBeenCalled();
                expect(fs.readFile).toHaveBeenCalledWith(absoluteFilePath, 'utf-8');
                expect(response.text).toEqual(fileContent);
            });
    });
});
