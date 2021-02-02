const LOCAL_STORAGE_MEMORY: Record<string, any> = {};

namespace Cypress {
    export interface Chainable {
        saveLocalStorage(): void;
        restoreLocalStorage(): void;
    }
}

Cypress.Commands.add('saveLocalStorage', () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
});

Cypress.Commands.add('restoreLocalStorage', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
});
