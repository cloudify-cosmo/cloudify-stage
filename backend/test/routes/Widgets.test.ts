import request from 'supertest';
import app from 'app';
import { getRBAC } from 'handler/AuthHandler';

jest.mock('handler/AuthHandler');

(<jest.Mock>getRBAC).mockResolvedValue({ permissions: {} });

describe('/widgets endpoint', () => {
    it('should validate install widget permission', async () => {
        const response = await request(app).delete('/console/widgets/widgetId');
        expect(response.statusCode).toBe(403);
    });
});
