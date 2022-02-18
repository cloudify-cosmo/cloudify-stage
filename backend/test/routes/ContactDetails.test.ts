import request from 'supertest';
import app from 'app';
import fs from 'fs';
import { jsonRequest } from 'handler/ManagerHandler';

jest.mock('handler/ManagerHandler');
jest.mock('fs');

describe('/contactDetails endpoint', () => {
    beforeEach(() => (<jest.Mock>jsonRequest).mockReset());

    it('allows to get positive submission status when hubspot request was done', () => {
        (<jest.Mock>fs.existsSync).mockReturnValueOnce(true);
        (<jest.Mock>jsonRequest).mockResolvedValue({ customer_id: 'something' });
        return request(app)
            .get('/console/contactDetails')
            .then(response => {
                expect(response.type).toContain('json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({ contactDetailsReceived: true });
                expect(jsonRequest).toBeCalledTimes(1);
            });
    });

    it('allows to get positive submission status when hubspot request was not done', () => {
        (<jest.Mock>fs.existsSync).mockReturnValueOnce(true);
        (<jest.Mock>fs.readFileSync).mockReturnValueOnce('{}');
        (<jest.Mock>jsonRequest).mockRejectedValueOnce({});
        return request(app)
            .get('/console/contactDetails')
            .then(response => {
                expect(response.type).toContain('json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({ contactDetailsReceived: true });
                expect(jsonRequest).toBeCalledTimes(3);
            });
    });

    it('allows to submit contact details', () => {
        return request(app)
            .post('/console/contactDetails')
            .send({ contactData: {} })
            .then(response => {
                expect(response.type).toContain('json');
                expect(response.statusCode).toBe(200);
                expect(fs.writeFileSync).toHaveBeenCalled();
                expect(jsonRequest).toHaveBeenCalledTimes(2);
            });
    });
});
