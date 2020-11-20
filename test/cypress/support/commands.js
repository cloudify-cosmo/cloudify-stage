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
import _ from 'lodash';

import './blueprints';
import './deployments';
import './executions';
import './users';
import './sites';
import './templates';
import './localStorage';
import './plugins';
import './editMode';
import './widgets';
import './secrets';
import './snapshots';

let token = '';

const getCommonHeaders = () => ({
    'Authentication-Token': token,
    tenant: 'default_tenant'
});

Cypress.Commands.add('restoreState', () => cy.restoreLocalStorage());

Cypress.Commands.add('waitUntilPageLoaded', () => {
    cy.log('Wait for widgets loaders to disappear');
    cy.get('div.loader', { timeout: 10000 }).should('not.be.visible');
});

Cypress.Commands.add('waitUntilLoaded', () => {
    cy.log('Wait for splash screen loader to disappear');
    cy.get('#loader', { timeout: 20000 }).should('be.not.visible');
    cy.waitUntilPageLoaded();
});

Cypress.Commands.add('uploadLicense', license =>
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
    )
);

Cypress.Commands.add('activate', (license = 'valid_trial_license') =>
    cy
        .uploadLicense(license)
        .then(() =>
            cy.request({
                method: 'GET',
                url: '/console/sp',
                qs: {
                    su: '/tokens'
                },
                headers: {
                    Authorization: `Basic ${btoa('admin:admin')}`,
                    'Content-Type': 'application/json'
                }
            })
        )
        .then(response => {
            token = response.body.value;
        })
        .then(() =>
            cy.stageRequest(`/console/ua/clear-pages?tenant=default_tenant`, 'GET', { failOnStatusCode: false })
        )
        .then(() => token)
);

Cypress.Commands.add('cfyRequest', (url, method = 'GET', headers = null, body = null, options = {}) =>
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
    })
);

Cypress.Commands.add('cfyFileRequest', (filePath, isBinaryFile, url, method = 'PUT', headers = null) => {
    const filePromise = isBinaryFile
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
                        xhr.setRequestHeader(name, value)
                    );
                    xhr.send(fileContent);
                })
        )
    );
});

Cypress.Commands.add('stageRequest', (url, method = 'GET', options) => {
    cy.request({
        method,
        url,
        headers: {
            'Content-Type': 'application/json',
            ...getCommonHeaders()
        },
        ...options
    });
});

Cypress.Commands.add('login', (username = 'admin', password = 'admin') => {
    cy.location('pathname').then(pathname => {
        if (pathname !== '/console/login') {
            cy.visit('/console/login');
        }
    });

    cy.get('.form > :nth-child(1) > .ui > input').clear().type(username);
    cy.get('.form > :nth-child(2) > .ui > input').clear().type(password);
    cy.get('.form > button').click();

    cy.get('.form > button.loading').should('be.not.visible', true);

    cy.getCookies()
        .should('have.length', 1)
        .then(cookies => {
            expect(cookies[0]).to.have.property('name', 'XSRF-TOKEN');
        });

    cy.waitUntilLoaded().then(() => cy.saveLocalStorage());
});

Cypress.Commands.add('visitPage', (name, id = null) => {
    cy.log(`Switching to '${name}' page`);
    cy.get('.sidebar.menu .pages').within(() => cy.contains(name).click({ force: true }));
    if (id) {
        cy.location('pathname').should('be.equal', `/console/page/${id}`);
    }
    cy.waitUntilPageLoaded();
});

function toIdObj(id) {
    return { id };
}

Cypress.Commands.add('usePageMock', (widgetIds, widgetConfiguration = {}) => {
    const widgetIdsArray = _.castArray(widgetIds);
    cy.server();
    cy.route('/console/widgets/list', widgetIds ? [...widgetIdsArray, 'filter', 'pluginsCatalog'].map(toIdObj) : []);
    cy.route('/console/templates', []);
    // required for drill-down testing
    cy.route('/console/templates/pages', widgetIds ? ['blueprint', 'deployment'].map(toIdObj) : []);
    cy.route('/console/ua', {
        appDataVersion: 4,
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
                                          width: 8,
                                          x: 0,
                                          y: 0
                                      },
                                      ..._.map(widgetIdsArray, (widgetId, index) => ({
                                          id: widgetId,
                                          definition: widgetId,
                                          configuration: widgetConfiguration,
                                          height: 20,
                                          drillDownPages: {},
                                          width: 8,
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
                                        jsonPath: 'http://repository.cloudifysource.org/cloudify/wagons/plugins.json'
                                    },
                                    height: 20
                                }
                            ]
                        }
                    ]
                },
                { id: 'admin_operations' }
            ]
        }
    });
});

Cypress.Commands.add('refreshPage', () => cy.get('.pageMenuItem.active').click({ force: true }));

Cypress.Commands.add('refreshTemplate', () => {
    cy.get('.tenantsMenu').click({ force: true });
    cy.contains('.text', 'default_tenant').click({ force: true });
});

function setContext(field, value) {
    cy.get(`.${field}FilterField`).click();
    cy.get(`.${field}FilterField input`).clear({ force: true }).type(`${value}`, { force: true });
    cy.waitUntilPageLoaded();
    cy.contains('.text', value).click();
    cy.get(`.${field}FilterField input`).type('{esc}', { force: true });
}

function clearContext(field) {
    cy.get(`.${field}FilterField .dropdown.icon`).click();
}

Cypress.Commands.add('setBlueprintContext', _.wrap('blueprint', setContext));
Cypress.Commands.add('clearBlueprintContext', _.wrap('blueprint', clearContext));
Cypress.Commands.add('setDeploymentContext', _.wrap('deployment', setContext));
Cypress.Commands.add('clearDeploymentContext', _.wrap('deployment', clearContext));
