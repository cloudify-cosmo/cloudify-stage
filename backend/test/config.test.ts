import { getConfig, loadMeJson } from 'config';

describe('Config', () => {
    beforeEach(() => jest.resetModules());
    it('should throw error', () => {
        jest.doMock('../../conf/me.json', () => {
            throw Error('Test error');
        });
        expect(loadMeJson).toThrow('Test error');
    });
    it('should construct manager URL', () => {
        jest.doMock('../../conf/me.json', () => ({}));
        loadMeJson();
        expect(getConfig('main').managerUrl).toBe('https://127.0.0.1:53333');
    });
});
