import request from 'supertest';
import app from 'app';
import { isAuthorized } from 'handler/AuthHandler';

jest.mock('handler/AuthHandler');

(<jest.Mock>isAuthorized).mockReturnValue(false);

describe('/widgets endpoint', () => {
    it('should validate install widget permission', async () => {
        const response = await request(app).delete('/console/widgets/widgetId');
        expect(response.statusCode).toBe(403);
    });
});
