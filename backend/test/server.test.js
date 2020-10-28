describe('Server', () => {
    it('should start', async () => {
        jest.mock('vm2', () => {
            return {
                NodeVM: jest.fn().mockImplementation(() => {
                    return {
                        run: () => Promise.resolve()
                    };
                }),
                VMScript: () => {}
            };
        });

        // eslint-disable-next-line global-require
        const server = await require('server');
        expect(server.listening).toBeTruthy();
        await server.close();
    });
});
