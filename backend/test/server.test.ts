import serverStart from 'server';

jest.mock('handler/ManagerHandler');

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

describe('Server', () => {
    it('should start', async () => {
        // eslint-disable-next-line global-require
        const server = await serverStart;
        expect(server.listening).toBeTruthy();
        await server.close();
    });
});
