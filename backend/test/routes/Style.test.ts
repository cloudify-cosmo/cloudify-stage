import request from 'supertest';
import app from 'app';
import css from 'css';

jest.mock('handler/ManagerHandler');

describe('/style endpoint', () => {
    it('allows to get style', () =>
        request(app)
            .get('/console/style')
            .then(response => expect(css.parse(response.text)).toBeTruthy()));
});
