// @ts-nocheck File not migrated fully to TS
import request from 'supertest';
import { existsSync, readFile, statSync } from 'fs-extra';
import os from 'os';
import path from 'path';
import { decompressArchive, saveDataFromUrl, removeOldExtracts } from 'handler/ArchiveHelper';
import app from 'app';

jest.mock('handler/ArchiveHelper');
(<jest.Mock>saveDataFromUrl).mockResolvedValue({ archiveFolder: '', archiveFile: '' });
(<jest.Mock>removeOldExtracts).mockResolvedValue();
(<jest.Mock>decompressArchive).mockResolvedValue();

jest.mock('fs-extra');
(<jest.Mock>existsSync).mockReturnValue(false);
(<jest.Mock>statSync).mockReturnValue({ isSymbolicLink: () => true });
const fileContent = 'fileContent';
(<jest.Mock>readFile).mockResolvedValue(fileContent);

describe('/source endpoint', () => {
    it('allows to get blueprint file', () => {
        return request(app)
            .get('/console/source/browse/blueprintId/file/timestamp/path/to/file.yaml')
            .then(response => {
                const blueprintDir = path.join(os.tmpdir(), 'cloudifyBrowseSources', 'blueprintIdtimestamp');
                const absoluteFilePath = path.join(blueprintDir, 'extracted', 'path', 'to', 'file.yaml');
                expect(existsSync).toHaveBeenCalledWith(absoluteFilePath);
                expect(removeOldExtracts).toHaveBeenCalled();
                expect(saveDataFromUrl).toHaveBeenCalledWith(
                    '/blueprints/blueprintId/archive',
                    blueprintDir,
                    expect.anything()
                );
                expect(decompressArchive).toHaveBeenCalled();
                expect(readFile).toHaveBeenCalledWith(absoluteFilePath, 'utf-8');
                expect(response.text).toEqual(fileContent);
            });
    });
});
