type CustomCypressCommands = Record<string, (...args: any[]) => Cypress.CanReturnChainable>;

/**
 * Returns an object that contains custom Cypress commands with correct return types
 * (Cypress.Chainable)
 */
export type GetCypressChainableFromCommands<CustomCommands extends CustomCypressCommands> = {
    [P in keyof CustomCommands]: void extends ReturnType<CustomCommands[P]>
        ? (...args: Parameters<CustomCommands[P]>) => Cypress.Chainable
        : CustomCommands[P];
};

export const addCommands = (commands: CustomCypressCommands) =>
    Object.entries(commands).forEach(([name, command]) => {
        Cypress.Commands.add(name, command);
    });
