const ManagerService = require('handler/services/ManagerService');
const ManagerHandler = require('handler/ManagerHandler');

jest.mock('handler/ManagerHandler', () => ({
    jsonRequest: jest.fn(() => Promise.resolve({ items: [] }))
}));

describe('ManagerService', () => {
    it('fetches all pages when performing GET request', () => {
        return ManagerService.doGetFull('').then(response => {
            expect(ManagerHandler.jsonRequest).toHaveBeenCalledWith('GET', '?_size=1000&_offset=0', {}, null);
            expect(response).toEqual({ items: [] });
        });
    });
});
