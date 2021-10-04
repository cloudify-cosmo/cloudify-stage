import request from 'supertest';
import app from 'app';
import { listWidgets } from 'handler/WidgetsHandler';

jest.mock('handler/WidgetsHandler');

describe('/widgets endpoint', () => {
    it('allows to list widgets', async () => {
        const expectedResponse = ['expectedWidget'];
        (<jest.Mock>listWidgets).mockResolvedValue(expectedResponse);

        const response = await request(app).get('/console/widgets/list');

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(expectedResponse);
    });
});
