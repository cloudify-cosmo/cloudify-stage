// @ts-nocheck File not migrated fully to TS
import fs from 'fs';
import path from 'path';
import { decompressArchive, saveDataFromUrl } from 'handler/ArchiveHelper';
import { request } from 'handler/RequestHandler';

jest.mock('handler/ManagerHandler');

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((method, url, headers, data, onSuccess, onError) => onError())
}));

describe('ArchiveHelper', () => {
    it('fetches external data with correct headers', () => {
        expect.assertions(1);
        const url = 'http://wp';
        return saveDataFromUrl(url).catch(() =>
            expect(request).toHaveBeenCalledWith(
                'GET',
                url,
                expect.objectContaining({ options: { headers: { 'User-Agent': 'Node.js' } } }),
                expect.anything(),
                expect.anything()
            )
        );
    });

    it('extracts specified archive to target directory', () => {
        const srcArchiveName = 'bangchak-poc';
        const srcArchivePath = path.resolve(path.join(__dirname, `fixtures/${srcArchiveName}.zip`));
        const destTargetDir = '/tmp';
        const destArchivePath = path.resolve(path.join(destTargetDir, srcArchiveName));

        if (fs.existsSync(destArchivePath)) fs.rmdirSync(destArchivePath, { recursive: true });

        return decompressArchive(srcArchivePath, destTargetDir).then(() => {
            expect(fs.existsSync(destArchivePath)).toBeTruthy();
            expect(fs.existsSync(path.join(destArchivePath, '.git'))).toBeTruthy();
        });
    });
});
