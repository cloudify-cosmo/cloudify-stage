describe('Config', () => {
    beforeEach(() => jest.resetModules());
    it('should throw error', () => {
        jest.doMock('../../conf/me.json', () => {
            throw Error('Test error');
        });
        expect(() => require('../config')).toThrow('Test error');
    });
    it('should construct manager URL', () => {
        jest.doMock('../../conf/me.json', () => ({}));
        const config = require('../config');
        expect(config.get('main').managerUrl).toBe('https://127.0.0.1:53333');
    });
});
