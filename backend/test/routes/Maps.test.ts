import request from 'supertest';
import app from 'app';
import nock from 'nock';

describe('/maps endpoint', () => {
    it('forwards requests to stadia and removes the HSTS header', () => {
        nock('https://tiles.stadiamaps.com').get('/tiles/osm_bright/0/0/0.png').query(true).reply(200, undefined, {
            'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
            'stadia-tileserver': 'lon-tileserver-g10-orlui'
        });
        return request(app)
            .get('/console/maps/0/0/0/?noCache=1611669199559')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['strict-transport-security']).toBe(undefined);
                expect(response.headers['stadia-tileserver']).toBe('lon-tileserver-g10-orlui');
            });
    });
});
