// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-file-upload';
import 'cypress-localstorage-commands';
import 'cypress-get-table';
import _ from 'lodash';
import type { RouteHandler, StringMatcher } from 'cypress/types/net-stubbing';
import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';

import './asserts';
import './blueprints';
import './deployments';
import './executions';
import './users';
import './sites';
import './templates';
import './plugins';
import './editMode';
import './widgets';
import './secrets';
import './snapshots';
import './filters';
import './getting_started';
import { getCurrentAppVersion } from './app_commons';

let token = '';

const getCommonHeaders = () => ({
    'Authentication-Token': token,
    tenant: 'default_tenant'
});

const mockGettingStarted = (modalEnabled: boolean) =>
    cy.interceptSp('GET', `/users/`, {
        body: { show_getting_started: modalEnabled }
    });

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {
            /**
             * Returns the table data
             *
             * @see {@link https://www.npmjs.com/package/cypress-get-table}
             */
            getTable: () => Cypress.Chainable<Record<string, any>[]>;

            /** Similar to `cy.contains(num)`, but makes sure the number is not a substring of some other number */
            containsNumber: (num: number) => Cypress.Chainable;
        }
    }
}

/** See `fixtures/license` directory */
type License =
    | 'expired_trial_license'
    | 'invalid_license'
    | 'tampered_paying_license'
    | 'valid_spire_license'
    | 'valid_trial_license';

const commands = {
    waitUntilPageLoaded: () => {
        cy.log('Wait for widgets loaders to disappear');
        cy.get('div.loader:visible', { timeout: 10000 }).should('not.exist');
    },
    waitUntilLoaded: () => {
        cy.log('Wait for splash screen loader to disappear');
        cy.get('#loader', { timeout: 20000 }).should('be.not.visible');
        cy.waitUntilPageLoaded();
    },
    uploadLicense: (license: License) =>
        cy.fixture(`license/${license}.yaml`).then(yaml =>
            cy.request({
                method: 'PUT',
                url: '/console/sp',
                qs: {
                    su: '/license'
                },
                headers: {
                    Authorization: `Basic ${btoa('admin:admin')}`,
                    'Content-Type': 'text/plain'
                },
                body: yaml
            })
        ),
    activate: (license: License = 'valid_trial_license') =>
        cy
            .uploadLicense(license)
            .getAdminToken()
            .then(adminToken => {
                token = adminToken;
            })
            .then(() =>
                cy.stageRequest(`/console/ua/clear-pages?tenant=default_tenant`, 'GET', { failOnStatusCode: false })
            ),
    cfyRequest: (
        url: string,
        method = 'GET',
        headers: any = null,
        body: any = null,
        options: Partial<Cypress.RequestOptions> = {}
    ) =>
        cy.request({
            method,
            url: '/console/sp',
            qs: {
                su: url
            },
            headers: {
                'Content-Type': 'application/json',
                ...getCommonHeaders(),
                ...headers
            },
            body,
            ...options
        }),
    cfyFileRequest: (filePath: string, isBinaryFile: boolean, url: string, method = 'PUT', headers: any = null) => {
        const filePromise: Cypress.Chainable<string | Blob> = isBinaryFile
            ? cy.fixture(filePath, 'binary').then(binary => Cypress.Blob.binaryStringToBlob(binary))
            : cy.fixture(filePath);

        return filePromise.then(fileContent =>
            cy.window().then(
                window =>
                    new Promise((resolve, reject) => {
                        const xhr = new window.XMLHttpRequest();
                        xhr.open(method, `/console/sp?su=${encodeURIComponent(url)}`);
                        xhr.onload = resolve;
                        xhr.onerror = reject;
                        Object.entries({ ...getCommonHeaders(), ...headers }).forEach(([name, value]) =>
                            xhr.setRequestHeader(name, value as string)
                        );
                        xhr.send(fileContent);
                    })
            )
        );
    },
    stageRequest: (url: string, method = 'GET', options?: Partial<Cypress.RequestOptions>, headers?: any) => {
        cy.request({
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                ...getCommonHeaders(),
                ...headers
            },
            ...options
        });
    },
    // TODO(RD-2314): object instead of multiple optional parameters
    login: (username = 'admin', password = 'admin', expectSuccessfulLogin = true, disableGettingStarted = true) => {
        mockGettingStarted(!disableGettingStarted);

        cy.location('pathname').then(pathname => {
            if (pathname !== '/console/login') {
                cy.visit('/console/login');
            }
        });

        cy.get('.form > :nth-child(1) > .ui > input').clear().type(username);
        cy.get('.form > :nth-child(2) > .ui > input').clear().type(password);
        cy.get('.form > button').click();

        cy.get('.form > button.loading').should('not.exist');

        if (expectSuccessfulLogin) {
            cy.getCookies()
                .should('have.length', 1)
                .then(cookies => {
                    expect(cookies[0]).to.have.property('name', 'XSRF-TOKEN');
                });

            cy.waitUntilLoaded().then(() => cy.saveLocalStorage());
        }
    },
    // TODO(RD-2314): object instead of multiple optional parameters
    mockLogin: (username?: string, password?: string, disableGettingStarted?: boolean) => {
        cy.mockLoginWithoutWaiting({ username, password, disableGettingStarted });
        cy.waitUntilLoaded();
    },
    mockLoginWithoutWaiting: ({
        username = 'admin',
        password = 'admin',
        disableGettingStarted = true
    }: {
        username?: string;
        password?: string;
        disableGettingStarted?: boolean;
    } = {}) => {
        cy.stageRequest('/console/auth/login', 'POST', undefined, {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
        }).then(response => {
            const { role } = response.body;
            cy.setLocalStorage(
                `manager-state-main`,
                JSON.stringify({
                    auth: { role, groupSystemRoles: {}, tenantsRoles: {} },
                    username
                })
            );
            if (disableGettingStarted) mockGettingStarted(false);
        });
        cy.visit('/console');
    },
    visitPage: (name: string, id: string | null = null) => {
        cy.log(`Switching to '${name}' page`);
        cy.get('.sidebar.menu .pages').within(() => cy.contains(name).click({ force: true }));
        if (id) {
            cy.location('pathname').should('be.equal', `/console/page/${id}`);
        }
        cy.waitUntilPageLoaded();
    },
    usePageMock: (
        widgetIds?: string | string[],
        widgetConfiguration: any = {},
        {
            widgetsWidth = 8,
            additionalWidgetIdsToLoad = [],
            additionalPageTemplates = []
        }: { widgetsWidth?: number; additionalWidgetIdsToLoad?: string[]; additionalPageTemplates?: string[] } = {}
    ) => {
        const widgetIdsArray = _.castArray(widgetIds);
        const widgetIdsToLoad = [...widgetIdsArray, 'filter', 'pluginsCatalog', ...additionalWidgetIdsToLoad];
        cy.intercept('GET', '/console/widgets/list', widgetIdsToLoad.map(toIdObj));
        // required for drill-down testing
        cy.intercept(
            'GET',
            '/console/templates/pages',
            widgetIds ? ['blueprint', 'deployment', ...additionalPageTemplates].map(toIdObj) : []
        );
        cy.intercept('GET', '/console/templates', []);
        cy.intercept('GET', '/console/ua', {
            appDataVersion: getCurrentAppVersion(),
            appData: {
                pages: [
                    {
                        name: 'Test Page',
                        id: 'test_page',
                        layout: widgetIds
                            ? [
                                  {
                                      type: 'widgets',
                                      content: [
                                          {
                                              id: 'filter',
                                              definition: 'filter',
                                              configuration: {
                                                  filterByBlueprints: true,
                                                  filterByDeployments: true,
                                                  filterByExecutionsStatus: true,
                                                  allowMultipleSelection: true
                                              },
                                              height: 2,
                                              width: widgetsWidth,
                                              x: 0,
                                              y: 0
                                          },
                                          ..._.map(widgetIdsArray, (widgetId, index) => ({
                                              id: widgetId,
                                              definition: widgetId,
                                              configuration: widgetConfiguration,
                                              height: 20,
                                              drillDownPages: {},
                                              width: widgetsWidth,
                                              x: 0,
                                              y: 2 + (index + 1) * 20
                                          }))
                                      ]
                                  }
                              ]
                            : []
                    },
                    // used by tests that require plugins
                    {
                        name: 'Plugins Catalog',
                        id: 'plugin_catalog',
                        layout: [
                            {
                                type: 'widgets',
                                content: [
                                    {
                                        id: 'pluginsCatalog',
                                        definition: 'pluginsCatalog',
                                        configuration: {
                                            jsonPath:
                                                'http://repository.cloudifysource.org/cloudify/wagons/plugins.json'
                                        },
                                        height: 20
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    },
    refreshPage: (disableGettingStarted = true) => {
        mockGettingStarted(!disableGettingStarted);
        cy.get('.pageMenuItem.active').click({ force: true });
    },
    refreshTemplate: (disableGettingStarted = true) => {
        mockGettingStarted(!disableGettingStarted);
        cy.get('.tenantsMenu').click({ force: true });
        cy.contains('.text', 'default_tenant').click({ force: true });
    },
    setBlueprintContext: (value: string) => setContext('blueprint', value),
    clearBlueprintContext: () => clearContext('blueprint'),

    setDeploymentContext: (value: string) => setContext('deployment', value),
    clearDeploymentContext: () => clearContext('deployment'),

    interceptSp: (method: StringMatcher, su: string | RegExp, routeHandler?: RouteHandler) =>
        cy.intercept(
            {
                method,
                pathname: '/console/sp',
                query: { su: su instanceof RegExp ? su : RegExp(`.*${_.escapeRegExp(su)}.*`) }
            },
            routeHandler
        ),
    getByTestId: (id: string) => cy.get(`[data-testid=${id}]`),
    getSearchInput: () => cy.get('input[placeholder="Search..."]'),

    /**
     * Compiles a script in the fixtures directory using babel
     *
     * @param fixturePath Path to script in the fixtures directory
     * @returns The compiled source
     */
    compileScriptFixture: (fixturePath: string) => {
        const { fixturesFolder } = Cypress.config();
        const scriptPath = `${fixturesFolder}/${fixturePath}`;
        const babelConfigPath = `${fixturesFolder}/babel.config.js`;

        return cy
            .exec(`./node_modules/.bin/babel --config-file ${babelConfigPath} ${scriptPath}`)
            .then(commandResult => commandResult.stdout);
    },

    setSearchableDropdownValue: (fieldName: string, value: string) => {
        cy.contains('.field', fieldName)
            .click()
            .within(() => {
                cy.get('input').type(value);
                cy.get(`div[option-value="${value}"]`).click();
            });
    },

    clearSearchableDropdown: (fieldName: string) => cy.contains('.field', fieldName).find('.dropdown.icon').click(),

    setDropdownValues: (fieldName: string, values: string[]) => {
        cy.contains('.field', fieldName)
            .click()
            .within(() => values.forEach(value => cy.contains('div[role=option]', value).click()))
            .click();
    },

    openTab: (tabName: string) => {
        cy.get('.tabular.menu').contains(tabName).click();
    },

    mockEnabledGettingStarted: () => mockGettingStarted(true),

    mockDisabledGettingStarted: () => mockGettingStarted(false)
};

addCommands(commands);

// See https://docs.cypress.io/api/cypress-api/custom-commands#Dual-Commands
Cypress.Commands.add('containsNumber', { prevSubject: 'optional' }, (subject: unknown | undefined, num: number) =>
    // eslint-disable-next-line security/detect-non-literal-regexp
    (subject ? cy.wrap(subject) : cy).contains(new RegExp(`\\b${num}\\b`))
);

function toIdObj(id: string) {
    return { id };
}

function setContext(field: string, value: string) {
    cy.get(`.${field}FilterField`)
        .click()
        .within(() => {
            cy.get('input').clear({ force: true }).type(`${value}`, { force: true });
            cy.waitUntilPageLoaded();
            cy.get(`[option-value="${value}"]`).click();
            cy.get('input').type('{esc}', { force: true });
        });
}

function clearContext(field: string) {
    cy.get(`.${field}FilterField .dropdown.icon`).click();
}
