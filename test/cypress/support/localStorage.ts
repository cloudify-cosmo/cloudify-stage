import { addCommands, GetCypressChainableFromCommands } from './command-utils';

const LOCAL_STORAGE_MEMORY: Record<string, any> = {};

declare global {
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    saveLocalStorage: () => {
        Object.keys(localStorage).forEach(key => {
            LOCAL_STORAGE_MEMORY[key] = localStorage[key];
        });
    },
    restoreLocalStorage: () => {
        Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
            localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
        });
    }
};

addCommands(commands);
