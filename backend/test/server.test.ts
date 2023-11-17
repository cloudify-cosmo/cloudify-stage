import serverStart from 'server';

jest.mock('handler/ManagerHandler');

jest.mock('isolated-vm', () => {
    const mockIsolate = {
        compileScript: jest.fn(),
        createSnapshot: jest.fn(),
        createReference: jest.fn(),
        release: jest.fn()
    };

    return {
        createContext: jest.fn(),
        isolate: jest.fn().mockReturnValue(mockIsolate)
    };
});

describe('Server', () => {
    it('should start', async () => {
        const server = await serverStart;
        expect(server.listening).toBeTruthy();
        await server.close();
    });
});
