import request from 'supertest';
import { writeJson } from 'fs-extra';

import app from 'app';

jest.mock('fs-extra');
(<jest.Mock>writeJson).mockReturnValue(Promise.resolve());

describe('/templates endpoint', () => {
    it('allows to create a page', () => {
        const pageData = { layout: [{}] };
        return request(app)
            .post('/console/templates/pages')
            .send(pageData)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(writeJson).toHaveBeenCalledWith(expect.any(String), expect.objectContaining(pageData), {
                    spaces: '  '
                });
            });
    });
});
