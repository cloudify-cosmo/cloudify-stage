const request = require('supertest');
const app = require('app');
const css = require('css');

describe('/style endpoint', () => {
    it('allows to get style', () =>
        request(app)
            .get('/console/style')
            .then(response => expect(css.parse(response.text)).toBeTruthy()));
});
