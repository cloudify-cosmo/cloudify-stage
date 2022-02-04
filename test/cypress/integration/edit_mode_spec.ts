// @ts-nocheck File not migrated fully to TS
describe('Edit mode', () => {
    before(() => cy.activate('valid_trial_license').removeCustomWidgets());

    beforeEach(() => {
        cy.usePageMock('blueprints');
        cy.mockLogin();
        cy.enterEditMode();
        cy.intercept('POST', '/console/ua').as('updateUserApps');
    });

    it('should allow to edit widget settings', () => {
        cy.get('.blueprintsWidget .setting').click({ force: true });

        cy.get('.pollingTime input').type(0);

        cy.contains('Save').click();
        cy.wait('@updateUserApps')
            .its('request.body')
            .should('have.nested.property', 'appData.pages[0].layout[0].content[1].configuration.pollingTime', 100);
    });

    it('should allow to remove widget', () => {
        cy.get('.blueprintsWidget .remove').click({ force: true });
        cy.wait('@updateUserApps')
            .its('request.body')
            .should('not.have.nested.property', 'appData.pages[0].layout[0].content[1]');
        cy.get('.blueprintsWidget').should('not.exist');
    });

    it('should allow to add widget', () => {
        const widget1Id = 'pluginsCatalog';
        cy.get('.addWidgetBtn').click();
        cy.get(`*[data-id=${widget1Id}]`).click();
        cy.contains('Add selected widgets').click();
        cy.wait('@updateUserApps').then(({ request }) => {
            expect(request.body).to.have.nested.property('appData.pages[0].layout[0].content[2].definition', widget1Id);
            expect(request.body).to.have.nested.property('appData.pages[0].layout[0].content[2].height');
            expect(request.body).to.have.nested.property('appData.pages[0].layout[0].content[2].x');
            expect(request.body).to.have.nested.property('appData.pages[0].layout[0].content[2].y');
        });

        cy.contains('Add Widgets Container').click();
        cy.wait('@updateUserApps');
        cy.get('.react-grid-layout').should('have.length', 2);

        const widget2Id = 'blueprints';
        cy.get('.addWidgetBtn:last()').click();
        cy.get(`*[data-id=${widget2Id}]`).click();
        cy.contains('Add selected widgets').click();
        cy.wait('@updateUserApps').then(({ request }) => {
            expect(request.body).to.have.nested.property('appData.pages[0].layout[1].content[0].definition', widget2Id);
            expect(request.body).to.have.nested.property('appData.pages[0].layout[1].content[0].height');
            expect(request.body).to.have.nested.property('appData.pages[0].layout[1].content[0].x');
            expect(request.body).to.have.nested.property('appData.pages[0].layout[1].content[0].y');
        });

        cy.contains('.widgetName', 'Plugins Catalog');
        cy.contains('.react-grid-layout:last() .widgetName', 'Blueprints');
    });

    it('should allow to manage tabs', () => {
        cy.contains('Add Tabs').click();
        cy.get('button[title="Remove tabs container"]').click();
        cy.contains('Yes').click();
        cy.contains('New Tab').should('not.exist');

        cy.contains('Add Tabs').click();

        cy.contains('New Tab').find('.remove').click();
        cy.get('.item:contains(New Tab)').should('have.length', 1);
        cy.get('.item .editModeButton .add').click();
        cy.get('.item:contains(New Tab)').should('have.length', 2);
        cy.contains('Add Tabs').click();
        cy.get('.item:contains(New Tab)').should('have.length', 4);
    });

    it('should allow to rename tab and set default tab', () => {
        cy.contains('Add Tabs').click();
        cy.wait('@updateUserApps');

        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal input[type=text]').type(2);
        cy.get('.modal .toggle').click();

        cy.contains('Save').click();
        cy.wait('@updateUserApps')
            .its('request.body')
            .should('have.nested.property', 'appData.pages[0].layout[1].content[0].name', 'New Tab2');

        cy.log('Verify default flag was set');
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal .toggle.checked');
        cy.contains('Cancel').click();

        cy.log('Set another tab as default');
        cy.get('.editModeButton .edit:eq(1)').click();
        cy.get('.modal .toggle').click();

        cy.contains('Save').click();
        cy.wait('@updateUserApps').then(({ request }) => {
            expect(request.body).to.have.nested.property('appData.pages[0].layout[1].content[0].isDefault', false);
            expect(request.body).to.have.nested.property('appData.pages[0].layout[1].content[1].isDefault', true);
        });

        cy.log('Verify previous tab is no longer default');
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal .toggle:not(.checked)');
    });

    it('should allow to add, remove and switch pages', () => {
        cy.contains('Add Page').click();

        cy.log('Verify empty page was added');
        cy.get('.pageMenuItem:last()').should('have.class', 'active').and('have.text', 'Page_0');
        cy.get('.page').within(() => {
            cy.contains('.pageTitle', 'Page_0');
            cy.contains('This page is empty');
            cy.contains("don't be shy, give it a meaning!");
            cy.contains('Add Tabs');
        });

        cy.log('Verify page switching works');
        cy.visitTestPage();
        cy.contains('.pageMenuItem.active', 'Test Page');
        cy.get('.page').within(() => {
            cy.contains('.pageTitle', 'Test Page');
            cy.get('.react-grid-item').should('have.length', 2);
            cy.get('.react-grid-item.filterWidget').should('be.visible');
            cy.get('.react-grid-item.blueprintsWidget').should('be.visible');
        });

        cy.log('Remove added page');
        cy.get('.pageMenuItem:last() .remove').click({ force: true });
        cy.contains('Page_0').should('not.exist');
    });

    describe('should open widget install modal and', () => {
        beforeEach(() => {
            cy.intercept('PUT', '/console/widgets/install*').as('installWidget');
            cy.intercept('DELETE', '/console/widgets/*').as('deleteWidget');
            cy.get('.addWidgetBtn').click();
            cy.contains('Install new widget').click();
        });

        function submitWidget(widgetName = '', addToPage = false) {
            const widgetFileName = `testWidget${widgetName}`;
            cy.log(`Installing widget ${widgetFileName}`);
            cy.get('.modal').within(() => {
                cy.get('.fileOrUrl').within(() => {
                    cy.get('.remove.icon').click({ force: true });
                    cy.contains('.label', 'URL');
                    cy.get('input[name=widgetFile]').attachFile(`widgets/${widgetFileName}.zip`);
                    cy.contains('.label', 'File');
                });
                cy.get('.actions button.green').click();
            });
            if (addToPage) {
                cy.get(`*[data-id=${widgetFileName}]`).click();
                cy.contains('Add selected widgets').click();
            }
        }

        function submitInvalidWidget(widgetName, expectedError, expectedStatus, expectedDelete = false) {
            submitWidget(widgetName);

            cy.wait('@installWidget').its('response.statusCode').should('equal', expectedStatus);

            if (expectedDelete) {
                cy.wait('@deleteWidget').its('response.statusCode').should('equal', 200);
            }

            cy.contains('.modal .message ul', expectedError).should('be.visible');
        }

        it('validate widget installation', () => {
            cy.log('Submit install widget form with no data');
            cy.contains('Install Widget').click();
            cy.contains("Please provide the widget's archive URL or select a file");

            cy.log('Submit install widget form with invalid URL');
            cy.get('input[name=widgetUrl]').type('test');
            cy.contains('Install Widget').click();
            cy.contains("Please provide valid URL for widget's archive");

            submitInvalidWidget(
                'IncorrectFiles',
                'The following files are required for widget registration: widget.js, widget.png',
                400
            );
            submitInvalidWidget(
                'InstallIncorrectDirectoryName',
                'Incorrect widget folder name not consistent with widget id. ' +
                    "Widget ID: 'testWidgetInstallIncorrectDirectoryName'. Directory name: 'testWidget'",
                400
            );
            submitInvalidWidget(
                'InvalidPermission',
                "Specified widget permission ('invalid_permission_name') not found in available permissions list.",
                200,
                true
            );
            submitInvalidWidget(
                'MandatoryFieldMissingName',
                "Mandatory field - 'name' - not specified in widget definition.",
                200,
                true
            );
            submitInvalidWidget('ModuleNotAllowed', "The module 'fs-extra' is not whitelisted in VM.", 404);
        });

        it('install and manage a widget', () => {
            submitWidget();

            cy.log('Verifying widget update validation');
            cy.contains('button', 'Update').click();
            submitInvalidWidget(
                'InvalidPermission',
                'Updated widget directory name invalid. ' +
                    "Expected: 'testWidget'. Received: 'testWidgetInvalidPermission'",
                200,
                false
            );

            cy.log('Verifying successful widget update');
            submitWidget();
            cy.contains('Update widget definition').should('not.exist');

            cy.log('Verifying same widget cannot be installed twice');
            cy.contains('Install new widget').click();
            submitInvalidWidget('', 'Widget testWidget is already installed', 422);
            cy.contains('Cancel').click();

            cy.log('Verifying widget can be removed');
            cy.contains('Remove').click();
            cy.contains('Yes').click();
            cy.contains('Test widget').should('not.exist');
        });

        it('install and use a widget', () => {
            cy.log('Verifying widget can be added to the page');
            submitWidget('', true);
            cy.get('.testWidgetWidget');

            cy.log('Verifying used widget can be uninstalled');
            cy.get('.addWidgetBtn').click();
            cy.contains('Remove').click();
            cy.contains('Yes').click();
            cy.contains('Test widget').should('not.exist');
            cy.get('.testWidgetWidget').should('not.exist');
        });

        it('install and use a widget with broken backend service', () => {
            cy.intercept('GET', '/console/wb/manager?endpoint=version').as('managerService');
            submitWidget('ModuleNotAllowedInService', true);
            cy.exitEditMode();

            cy.get('input[name="endpoint"]').type('version');
            cy.contains('Fire').click();

            cy.wait('@managerService').its('response.statusCode').should('equal', 404);

            cy.get('.message .content').should('have.text', "404 - The module 'fs-extra' is not whitelisted in VM.");
        });

        it('install and use a widget with working backend services', () => {
            const widgetName = 'Backend';
            const widgetId = `testWidget${widgetName}`;
            const url = 'https://this-page-intentionally-left-blank.org/';
            const verifyRequest = service =>
                cy.wait(service).then(({ request, response }) => {
                    expect(request.headers).contain({ 'widget-id': widgetId });
                    expect(response.statusCode).equals(200);
                });
            const verifyResponse = text => cy.get('.widgetContent .ui.segment pre code').should('contain.text', text);

            cy.intercept({ method: 'GET', pathname: '/console/wb/manager', query: { endpoint: 'version' } }).as(
                'managerService'
            );
            cy.intercept({ method: 'GET', pathname: `/console/wb/request`, query: { url } }).as('requestService');
            submitWidget(widgetName, true);
            cy.exitEditMode();

            cy.log('Verifying manager service');
            cy.get('input[name="endpoint"]').type('version');
            cy.contains('Fire').click();

            verifyRequest('@managerService');
            verifyResponse('"edition": "premium"');

            cy.log('Verifying request service');
            cy.editWidgetConfiguration(widgetId, () => {
                cy.get('div[name="service"]').click();
                cy.get('div[option-value="request"]').click();
            });
            cy.get('input[name="url"]').type(url);
            cy.contains('Fire').click();

            verifyRequest('@requestService');
            verifyResponse('This page intentionally left blank');
        });
    });
});
