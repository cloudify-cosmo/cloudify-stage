import fs from 'fs';
import path from 'path';
import { decompressArchive, saveDataFromUrl } from 'handler/ArchiveHelper';
import { request } from 'handler/RequestHandler';

jest.mock('handler/ManagerHandler');

jest.mock('handler/RequestHandler', () => ({
    request: jest.fn((_method, _url, _headers, _data, _onSuccess, onError) => onError())
}));

describe('ArchiveHelper', () => {
    it('fetches external data with correct headers', () => {
        expect.assertions(1);
        const url = 'http://wp';
        return saveDataFromUrl(url, '').catch(() =>
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
        const srcArchivePath = path.resolve(path.join(__dirname, 'fixtures/ArchiveHelper.test.zip'));
        const destTargetDir = '/tmp';
        const destArchivePath = path.resolve(path.join(destTargetDir, 'bangchak-poc'));

        if (fs.existsSync(destArchivePath)) fs.rmdirSync(destArchivePath, { recursive: true });

        return decompressArchive(srcArchivePath, destTargetDir).then(() => {
            expect(fs.existsSync(destArchivePath)).toBeTruthy();
            expect(fs.existsSync(path.join(destArchivePath, '.git'))).toBeTruthy();
        });
    });
});
