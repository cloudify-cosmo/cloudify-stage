import request from 'supertest';
import { existsSync, writeJson } from 'fs-extra';
import app from 'app';

jest.mock('fs-extra');

describe('/snapshots/configuration endpoint', () => {
    it('gets snapshot data', () => {
        return request(app)
            .get('/console/snapshots/configuration')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({});
            });
    });

    it('restores snapshot data', () => {
        return request(app)
            .post('/console/snapshots/configuration')
            .send({ 'overrides.json': {} })
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(writeJson).toHaveBeenCalledWith(expect.stringMatching('/userData/overrides.json$'), {});
            });
    });

    it('validates payload', () => {
        return request(app)
            .post('/console/snapshots/configuration')
            .send({ 'unsupported.json': {} })
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });

    it('prevents configuration files from being overwritten', () => {
        (<jest.Mock>existsSync).mockResolvedValue(true);
        return request(app)
            .post('/console/snapshots/configuration')
            .send({ 'overrides.json': {} })
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
});
