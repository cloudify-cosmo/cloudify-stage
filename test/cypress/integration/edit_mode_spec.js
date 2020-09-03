describe('Edit mode', () => {
    before(() => cy.activate('valid_trial_license').removeCustomWidgets());

    beforeEach(() => {
        cy.fixture('page/page_with_tabs').then(testPage =>
            cy.stageRequest('/console/ua', 'POST', {
                body: {
                    appData: {
                        pages: [testPage]
                    },
                    version: 4
                }
            })
        );
        cy.login().enterEditMode();
    });

    it('should allow to edit widget settings', () => {
        cy.get('.blueprintsWidget .setting').click({ force: true });

        cy.get('.pollingTime input').type(0);
        cy.contains('Save').click();

        cy.reload();
        cy.enterEditMode();

        cy.get('.blueprintsWidget .setting').click({ force: true });
        cy.get('.pollingTime input').should('have.value', '100');
    });

    it('should allow to remove widget', () => {
        cy.get('.blueprintsWidget .remove').click({ force: true });
        cy.get('.blueprintsWidget').should('not.exist');

        cy.reload();
        cy.contains('.widgetName', 'Catalog').should('be.visible');
        cy.get('.blueprintsWidget').should('not.exist');
    });

    it('should allow to add widget', () => {
        cy.get('.editModeButton:contains(Add Widget):eq(1)').click();
        cy.get('*[data-id=blueprintSources]').click();
        cy.contains('Add selected widgets').click();
        cy.contains('.message', 'Edit mode')
            .contains('Exit')
            .click();

        cy.contains('.react-grid-layout:eq(1) .widgetName', 'Blueprint Sources');

        cy.reload();
        cy.contains('.react-grid-layout:eq(1) .widgetName', 'Blueprint Sources');
    });

    it('should allow to remove and add tabs', () => {
        cy.get('.editModeButton .remove:eq(0)').click();
        cy.contains('Yes').click();
        cy.get('.editModeButton .remove').click();
        cy.contains('Yes').click();

        cy.contains('Add Tabs').click();

        cy.get('.editModeButton .remove:eq(0)').click();
        cy.get('.item:contains(New Tab)').should('have.length', 1);
        cy.get('.item .editModeButton .add').click();
        cy.get('.item:contains(New Tab)').should('have.length', 2);
    });

    it('should allow to rename tab and set default tab', () => {
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal input[type=text]').type(2);
        cy.get('.modal .toggle').click();
        cy.contains('Save').click();

        cy.log('Verify default flag was set');
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal .toggle.checked');
        cy.contains('Cancel').click();

        cy.log('Set another tab as default');
        cy.get('.editModeButton .edit:eq(1)').click();
        cy.get('.modal .toggle').click();
        cy.contains('Save').click();

        cy.log('Verify previous tab is no longer default');
        cy.get('.editModeButton .edit:eq(0)').click();
        cy.get('.modal .toggle:not(.checked)');

        cy.log('Verify updates are preserved');
        cy.reload().waitUntilLoaded();
        cy.contains('Tab12').should('not.have.class', 'active');
        cy.contains('Tab2').should('have.class', 'active');
    });

    it('should allow to add and remove pages', () => {
        cy.contains('Add Page').click();

        cy.log('Verify empty page was added');
        cy.get('.pageMenuItem:last()')
            .should('have.class', 'active')
            .should('have.text', 'Page_0');
        cy.contains('.pageTitle', 'Page_0');
        cy.contains('This page is empty');
        cy.contains("don't be shy, give it a meaning!");
        cy.contains('Add Tabs');

        cy.log('Remove added page');
        cy.get('.pageMenuItem:last() .remove').click({ force: true });
        cy.contains('Page_0').should('not.exist');
    });

    describe('should open widget install modal and', () => {
        beforeEach(() => {
            cy.server();
            cy.route('PUT', '/console/widgets/install*').as('installWidget');
            cy.route('DELETE', '/console/widgets/*').as('deleteWidget');
            cy.get('.editModeButton:contains(Add Widget):eq(1)').click();
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

            cy.wait('@installWidget')
                .its('status')
                .should('equal', expectedStatus);

            if (expectedDelete) {
                cy.wait('@deleteWidget')
                    .its('status')
                    .should('equal', 200);
            }

            cy.get('.modal .message ul').should('have.text', expectedError);
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
            cy.get('.editModeButton:contains(Add Widget):eq(1)').click();
            cy.contains('Remove').click();
            cy.contains('Yes').click();
            cy.contains('Test widget').should('not.exist');
            cy.get('.testWidgetWidget').should('not.exist');
        });

        it('install and use a widget with broken backend service', () => {
            cy.route('GET', '/console/wb/manager?endpoint=version').as('managerService');
            submitWidget('ModuleNotAllowedInService', true);
            cy.exitEditMode();

            cy.get('input[name="endpoint"]').type('version');
            cy.contains('Fire').click();

            cy.wait('@managerService')
                .its('status')
                .should('equal', 404);

            cy.get('.message .content').should('have.text', "404 - The module 'fs-extra' is not whitelisted in VM.");
        });

        it('install and use a widget with working backend services', () => {
            const widgetName = 'Backend';
            const widgetId = `testWidget${widgetName}`;
            const url = 'https://this-page-intentionally-left-blank.org/';
            const verifyRequest = service =>
                cy.wait(service).then(xhr => {
                    expect(xhr.requestHeaders).contain({ 'widget-id': widgetId });
                    expect(xhr.status).equals(200);
                });
            const verifyResponse = text => cy.get('.widgetContent .ui.segment pre code').should('contain.text', text);

            cy.route('GET', '/console/wb/manager?endpoint=version').as('managerService');
            cy.route('GET', `/console/wb/request?url=${url}`).as('requestService');
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
