import request from 'supertest';
import decompress from 'decompress';
import path from 'path';
import app from 'app';
import validateUniqueness from 'handler/widgets/validateUniqueness';
import { importWidgetBackend } from 'handler/BackendHandler';
import installFiles from 'handler/widgets/installFiles';

jest.mock('handler/widgets/validateUniqueness');
jest.mock('handler/widgets/installFiles');
jest.mock('handler/BackendHandler');
jest.mock('handler/AuthHandler');

describe('/snapshots/widgets endpoint', () => {
    it('allows to get snapshot data', () => {
        return request(app)
            .get('/console/snapshots/widgets')
            .responseType('blob')
            .then(response => {
                expect(response.statusCode).toBe(200);
                return decompress(response.body);
            });
    });

    it('allows to restore snapshot data', () => {
        (<jest.Mock>validateUniqueness).mockResolvedValue(null);
        (<jest.Mock>importWidgetBackend).mockResolvedValue(null);
        (<jest.Mock>installFiles).mockResolvedValue(null);
        return request(app)
            .post('/console/snapshots/widgets')
            .attach('snapshot', path.join(__dirname, '../fixtures/snapshots/widgets.zip'))
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(validateUniqueness).toHaveBeenCalledTimes(2);
                expect(validateUniqueness).toHaveBeenCalledWith('testWidget');
                expect(validateUniqueness).toHaveBeenCalledWith('testWidgetBackend');
                expect(installFiles).toHaveBeenCalledTimes(2);
                expect(installFiles).toHaveBeenCalledWith('testWidget', expect.stringMatching('/testWidget$'));
                expect(installFiles).toHaveBeenCalledWith(
                    'testWidgetBackend',
                    expect.stringMatching('/testWidgetBackend')
                );
                expect(importWidgetBackend).toHaveBeenCalledTimes(2);
                expect(importWidgetBackend).toHaveBeenCalledWith('testWidget');
                expect(importWidgetBackend).toHaveBeenCalledWith('testWidgetBackend');
            });
    });
});
