import managerService from 'handler/services/ManagerService';
import { jsonRequest } from 'handler/ManagerHandler';

jest.mock('handler/ManagerHandler', () => ({
    jsonRequest: jest.fn(() => Promise.resolve({ items: [] }))
}));

describe('ManagerService', () => {
    it('fetches all pages when performing GET request', () => {
        return managerService.doGetFull('').then(response => {
            expect(jsonRequest).toHaveBeenCalledWith('GET', '?_size=1000&_offset=0', {}, null, undefined);
            expect(response).toEqual({ items: [] });
        });
    });
});
