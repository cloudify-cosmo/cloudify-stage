const request = require('supertest');

jest.mock('handler/ManagerHandler', () => ({
    getApiUrl: () => 'https://raw.githubusercontent.com',
    updateOptions: jest.fn()
}));

const app = require('app');
const { updateOptions } = require('handler/ManagerHandler');

describe('/sp endpoint', () => {
    it('sets manager request options', () =>
        request(app)
            .put('/console/sp?su=/blueprints')
            .then(() => expect(updateOptions).toHaveBeenCalledWith({}, 'PUT')));
});
