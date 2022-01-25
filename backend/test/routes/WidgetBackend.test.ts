import request from 'supertest';
import app from 'app';
import { callService } from 'handler/BackendHandler';

jest.mock('handler/BackendHandler');
(<jest.Mock>callService).mockImplementation(
    (_serviceName, _method, _req, res, _next) => new Promise(() => res.send(''))
);

describe('/wb endpoint', () => {
    it(`allows to call widget backend service`, async () => {
        const serviceName = 'test_service';

        await request(app).get(`/console/wb/${serviceName}`);

        expect(callService).toHaveBeenCalledWith(
            serviceName,
            'GET',
            expect.any(Object),
            expect.any(Object),
            expect.any(Function)
        );
    });
});
