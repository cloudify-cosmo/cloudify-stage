// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import type { ManagerData } from 'app/reducers/managerReducer';
import emptyState from 'app/reducers/managerReducer/emptyState';
import Consts from 'app/utils/consts';
import type { Mode } from 'backend/serverSettings';
import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';
import 'cypress-file-upload';
import 'cypress-get-table';
import 'cypress-localstorage-commands';
import type { GlobPattern, RouteHandler, RouteMatcherOptions } from 'cypress/types/net-stubbing';
import { castArray, isString, noop } from 'lodash';
import './asserts';
import './blueprints';
import './deployments';
import './editMode';
import './executions';
import './filters';
import './getting_started';
import './labels';
import './plugins';

import { secondsToMs } from './resource_commons';
import './secrets';
import './sites';
import './snapshots';
import './templates';
import './users';
import './widgets';

let token = '';

const getCommonHeaders = () => ({
    cookie: `${Consts.TOKEN_COOKIE_NAME}=${token}`,
    tenant: Consts.DEFAULT_TENANT
});

const getAdminAuthorizationHeader = () => ({ Authorization: `Basic ${btoa('admin:admin')}` });

const mockGettingStarted = (modalEnabled: boolean) =>
    cy.intercept('GET', '/console/auth/user', req => {
        req.on('response', res => {
            const responseBody = {
                ...res.body,
                showGettingStarted: modalEnabled
            };
            res.send(responseBody);
        });
    });

const collapseSidebar = () => cy.get('.breadcrumb').click();

export const testPageName = 'Test Page';

interface LoginOptions {
    username?: string;
    password?: string;
    disableGettingStarted?: boolean;
    visitPage?: string;
    isCommunity?: boolean;
}

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

            clickButton: (buttonLabel: string) => Cypress.Chainable;
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
        cy.get('.widget').should('exist');
        cy.contains('Loading...').should('not.exist');
        return cy.waitUntilWidgetsDataLoaded();
    },
    waitUntilWidgetsDataLoaded: () => cy.get('div.loader:visible', { timeout: 10000 }).should('not.exist'),
    waitUntilAppLoaded: () =>
        cy
            .log('Wait for splash screen loader to disappear')
            .get('#loader', { timeout: secondsToMs(25) })
            .should('be.not.visible'),
    waitUntilLoaded: () => cy.waitUntilAppLoaded().waitUntilPageLoaded(),
    uploadLicense: (license: License) =>
        cy.fixture(`license/${license}.yaml`).then(yaml =>
            cy.request({
                method: 'PUT',
                url: '/console/sp/license',
                headers: {
                    ...getAdminAuthorizationHeader(),
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
                cy.stageRequest(`/console/ua/clear-pages?tenant=${Consts.DEFAULT_TENANT}`, 'GET', {
                    failOnStatusCode: false
                })
            ),
    cfyRequest: (
        url: string,
        method = 'GET',
        headers: any = null,
        body: any = null,
        options: Partial<Cypress.RequestOptions> & { useAdminAuthorization?: boolean } = {
            useAdminAuthorization: false
        }
    ) =>
        cy.request({
            method,
            url: `/console/sp${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...getCommonHeaders(),
                ...(options.useAdminAuthorization ? getAdminAuthorizationHeader() : {}),
                ...headers
            },
            body,
            ...options
        }),
    cfyFileRequest: (filePath: string, isBinaryFile: boolean, url: string, timeout?: number) => {
        const filePromise: Cypress.Chainable<string | Blob> = isBinaryFile
            ? cy.fixture(filePath, 'binary').then(binary => Cypress.Blob.binaryStringToBlob(binary))
            : cy.fixture(filePath);

        return filePromise.then(fileContent =>
            cy.window().then(
                { timeout },
                window =>
                    new Promise((resolve, reject) => {
                        const xhr = new window.XMLHttpRequest();
                        xhr.open('PUT', `/console/sp${url}`);
                        xhr.onload = resolve;
                        xhr.onerror = reject;
                        // NOTE: Cookie cannot be set when using XMLHttpRequest, so need to use "Authorization" header
                        Object.entries({
                            ...getCommonHeaders(),
                            ...getAdminAuthorizationHeader()
                        }).forEach(([name, value]) => xhr.setRequestHeader(name, value as string));
                        if (isBinaryFile) {
                            xhr.setRequestHeader('Content-type', 'application/octet-stream');
                        }
                        xhr.send(fileContent);
                    })
            )
        );
    },
    stageRequest: (url: string, method = 'GET', options?: Partial<Cypress.RequestOptions>, headers?: any) =>
        cy.request({
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                ...getCommonHeaders(),
                ...headers
            },
            ...options
        }),
    login: ({
        username = 'admin',
        password = 'admin',
        expectSuccessfulLogin = true,
        forceVisitLoginPage = false,
        disableGettingStarted = true
    }: {
        username?: string;
        password?: string;
        expectSuccessfulLogin?: boolean;
        forceVisitLoginPage?: boolean;
        disableGettingStarted?: boolean;
    } = {}) => {
        mockGettingStarted(!disableGettingStarted);

        cy.location('pathname').then(pathname => {
            if (forceVisitLoginPage || pathname !== '/console/login') {
                cy.visit('/console/login');
            }
        });

        cy.get('form').within(() => {
            cy.get('input').eq(0).clear().type(username);
            cy.get('input').eq(1).clear().type(password);
            cy.get('button').click();
            cy.get('button.loading').should('not.exist');
        });

        if (expectSuccessfulLogin) {
            cy.getCookies()
                .should('have.length', 1)
                .then(cookies => {
                    expect(cookies[0]).to.have.property('name', 'XSRF-TOKEN');
                });

            cy.waitUntilAppLoaded();
        }
        return cy;
    },
    mockLogin: ({
        username = 'admin',
        password = 'admin',
        disableGettingStarted = true,
        visitPage = '/console',
        isCommunity = false
    }: LoginOptions = {}) =>
        cy
            .mockLoginWithoutWaiting({ username, password, disableGettingStarted, visitPage, isCommunity })
            .waitUntilLoaded(),
    mockLoginWithoutWaiting: ({
        username = 'admin',
        password = 'admin',
        disableGettingStarted = true,
        visitPage = '/console',
        isCommunity = false
    }: LoginOptions = {}) => {
        cy.stageRequest('/console/auth/login', 'POST', undefined, {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
        }).then(response => {
            const { role } = response.body;
            cy.initLocalStorage({
                username,
                role,
                mode: isCommunity ? 'community' : 'main'
            });
            if (disableGettingStarted) mockGettingStarted(false);
        });
        return cy.visit(visitPage);
    },
    initLocalStorage: ({
        username = 'admin',
        role = 'sys_admin',
        mode = 'main',
        showGettingStarted = false
    }: {
        username?: string;
        role?: string;
        mode?: Mode;
        showGettingStarted?: boolean;
    } = {}) =>
        cy.setLocalStorage(
            `manager-state-${mode}`,
            JSON.stringify({
                ...emptyState,
                auth: { ...emptyState.auth, role, username, state: 'loggedIn', showGettingStarted }
            } as ManagerData)
        ),
    clickPageMenuItem: (name: string, expectedPageId: string | null = null) => {
        cy.log(`Clicking '${name}' page menu item`);
        cy.get('.sidebar.menu .pages').contains(name).click({ force: true });
        if (expectedPageId) {
            cy.verifyLocationByPageId(expectedPageId);
        }
        return cy.waitUntilWidgetsDataLoaded();
    },
    clickSystemMenuItem: (name: string) => {
        cy.log(`Clicking '${name}' system menu item`);
        cy.get('.sidebar.menu').contains('a.item', name).click({ force: true });
    },
    visitPage: (name: string, expectedPageId: string | null = null) => {
        cy.clickPageMenuItem(name, expectedPageId);
        return collapseSidebar();
    },
    visitSubPage: (groupName: string, pageName: string, expectedPageId: string | null = null) => {
        cy.clickPageMenuItem(groupName).visitPage(pageName, expectedPageId);
        return collapseSidebar();
    },
    visitTestPage: () => {
        cy.clickPageMenuItem(testPageName);
        return collapseSidebar();
    },
    usePageMock: (
        widgetIds?: string | string[],
        widgetConfiguration: any = {},
        { widgetsWidth = 8 }: { widgetsWidth?: number } = {}
    ) => {
        const widgetIdsArray = castArray(widgetIds);
        cy.intercept('GET', '/console/templates', []);
        return cy.intercept('GET', '/console/ua', {
            appDataVersion: Consts.APP_VERSION,
            appData: {
                pages: [
                    {
                        name: testPageName,
                        id: 'test_page',
                        type: 'page',
                        layout: widgetIds
                            ? [
                                  {
                                      type: 'widgets',
                                      content: [
                                          {
                                              id: 'filter',
                                              name: 'Resource Filter',
                                              definition: 'filter',
                                              configuration: {
                                                  filterByBlueprints: true,
                                                  filterByDeployments: true,
                                                  filterByExecutionsStatus: true,
                                                  allowMultipleSelection: true
                                              },
                                              drillDownPages: {},
                                              height: 2,
                                              width: widgetsWidth,
                                              x: 0,
                                              y: 0,
                                              maximized: false
                                          },
                                          ...widgetIdsArray.map((widgetId, index) => ({
                                              id: widgetId,
                                              definition: widgetId,
                                              configuration: widgetConfiguration,
                                              drillDownPages: {},
                                              height: 20,
                                              width: widgetsWidth,
                                              x: 0,
                                              y: 2 + (index + 1) * 20,
                                              maximized: false
                                          }))
                                      ]
                                  }
                              ]
                            : []
                    }
                ]
            }
        });
    },
    useWidgetWithDefaultConfiguration: (widgetId: string, widgetConfigurationOverrides: any = {}) =>
        cy
            .usePageMock(widgetId, widgetConfigurationOverrides)
            .mockLogin()
            // TODO(RD-1820): Currently we don't supply widget's default configuration when rendering.
            // In order to load default configuration for widget widget edit configuration modal should be opened
            // and configuration saved without making any changes
            .editWidgetConfiguration(widgetId, noop),
    refreshPage: () => {
        cy.get('.pageMenuItem.active').click({ force: true });
        return collapseSidebar();
    },
    refreshTemplate: () => {
        return cy.contains('.text', Consts.DEFAULT_TENANT).click({ force: true });
    },
    setBlueprintContext: (value: string) => setContext('blueprint', value),
    clearBlueprintContext: () => clearContext('blueprint'),

    setDeploymentContext: (value: string) => setContext('deployment', value),
    clearDeploymentContext: () => clearContext('deployment'),

    interceptSp: (method: string, spRouteMatcher: GlobPattern | RouteMatcherOptions, routeHandler?: RouteHandler) => {
        const routeMatcher: RouteMatcherOptions = { method };
        if (isString(spRouteMatcher)) {
            // eslint-disable-next-line scanjs-rules/assign_to_pathname
            routeMatcher.pathname = `/console/sp${spRouteMatcher}`;
        } else {
            Object.assign(routeMatcher, spRouteMatcher);
            if (routeMatcher.pathname)
                // eslint-disable-next-line scanjs-rules/assign_to_pathname
                routeMatcher.pathname = `/console/sp${routeMatcher.pathname}`;
            if (routeMatcher.path) routeMatcher.path = `/console/sp${routeMatcher.path}`;
        }

        return cy.intercept(routeMatcher, routeHandler);
    },
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

    getAccordionSection: (sectionTitle: string) => cy.contains('.accordion .title', sectionTitle),

    openAccordionSection: (sectionTitle: string) => cy.getAccordionSection(sectionTitle).click(),

    withinAccordionSection: (sectionTitle: string, callback: () => void) => {
        cy.openAccordionSection(sectionTitle).next('.content').within(callback);
    },

    getField: (fieldName: string) => cy.contains('.field', fieldName),

    typeToFieldInput: (fieldName: string, text: string) => cy.getField(fieldName).find('input').clear().type(text),

    setSearchableDropdownValue: (fieldName: string, value: string) => {
        if (value) {
            return cy
                .getField(fieldName)
                .click()
                .within(() => {
                    cy.get('input').type(value);
                    cy.get(`div[option-value="${value}"]`).click();
                });
        }
        return cy
            .getField(fieldName)
            .find('i.dropdown')
            .then($icon => {
                if ($icon.hasClass('clear')) cy.clearSearchableDropdown(fieldName);
            });
    },

    clearSearchableDropdown: (fieldName: string) => cy.getField(fieldName).find('.dropdown.clear.icon').click(),

    setSingleDropdownValue: (fieldName: string, value: string) =>
        cy
            .getField(fieldName)
            .click()
            .within(() => cy.contains('div[role=option]', value).click()),

    setMultipleDropdownValues: (fieldName: string, values: string[]) =>
        cy
            .getField(fieldName)
            .click()
            .within(() => values.forEach(value => cy.contains('div[role=option]', value).click()))
            .click(),
    clearMultipleDropdown: (fieldName: string) => cy.getField(fieldName).find('.delete.icon').click({ multiple: true }),

    containsActiveTab: (tabName: string) => cy.get('.tabular.menu .active.item').contains(tabName),
    openTab: (tabName: string) => cy.get('.tabular.menu').contains(tabName).click(),

    getWidget: (widgetId: string) => cy.get(`.${widgetId}Widget`),
    clickButton: (buttonLabel: string) => cy.contains('button', buttonLabel).click()
};

addCommands(commands);

// See https://docs.cypress.io/api/cypress-api/custom-commands#Dual-Commands
Cypress.Commands.add('containsNumber', { prevSubject: 'optional' }, (subject: unknown | undefined, num: number) =>
    // eslint-disable-next-line security/detect-non-literal-regexp
    (subject ? cy.wrap(subject) : cy).contains(new RegExp(`\\b${num}\\b`))
);
Cypress.Commands.add('clickButton', { prevSubject: 'optional' }, (subject: unknown | undefined, buttonLabel: string) =>
    (subject ? cy.wrap(subject) : cy).contains('button', buttonLabel).click()
);

function setContext(field: string, value: string) {
    cy.get(`.${field}FilterField`)
        .click()
        .within(() => {
            cy.get('input').clear({ force: true }).type(`${value}`, { force: true });
            cy.waitUntilWidgetsDataLoaded();
            cy.get(`[option-value="${value}"]`).click();
            cy.get('input').type('{esc}', { force: true });
        });
}

function clearContext(field: string) {
    return cy.get(`.${field}FilterField .dropdown.icon`).click();
}
