describe('Edit mode', () => {
    before(() => cy.activate('valid_trial_license'));

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
        cy.login();
        cy.get('.usersMenu')
            .click()
            .contains('Edit Mode')
            .click();
    });

    it('should allow to edit widget settings', () => {
        cy.get('.blueprintsWidget .setting').click({ force: true });

        cy.get('.pollingTime input').type(0);
        cy.contains('Save').click();

        cy.reload();
        cy.get('.usersMenu').click();
        cy.contains('Edit Mode').click();

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
            cy.get('.editModeButton:contains(Add Widget):eq(1)').click();
            cy.contains('Install new widget').click();
        });

        function submitWidget(widgetName = '') {
            const widgetFileName = `testWidget${widgetName}`;
            cy.log(`Installing widget ${widgetFileName}`);
            cy.get('input[name=widgetFile]').attachFile(`widgets/${widgetFileName}.zip`);
            cy.contains('.fileOrUrl .label', 'File');
            cy.get('.actions button.green').click();
        }

        function submitInvalidWidget(widgetName, errorMessage) {
            submitWidget(widgetName);
            cy.contains(errorMessage);
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
                'The following files are required for widget registration: widget.js, widget.png'
            );
            submitInvalidWidget(
                'InstallIncorrectDirectoryName',
                'Incorrect widget folder name not consistent with widget id. ' +
                    "Widget ID: 'testWidgetInstallIncorrectDirectoryName'. Directory name: 'testWidget'"
            );
            submitInvalidWidget(
                'InvalidPermission',
                "Specified widget permission ('invalid_permission_name') not found in available permissions list."
            );
            submitInvalidWidget(
                'MandatoryFieldMissingName',
                "Mandatory field - 'name' - not specified in widget definition."
            );
        });

        it('install and manage a widget', () => {
            submitWidget();

            cy.log('Verifying widget update validation');
            cy.contains('button', 'Update').click();
            submitInvalidWidget(
                'InvalidPermission',
                'Updated widget directory name invalid. ' +
                    "Expected: 'testWidget'. Received: 'testWidgetInvalidPermission'"
            );

            cy.log('Verifying successful widget update');
            submitWidget();
            cy.contains('Update widget definition').should('not.exist');

            cy.log('Verifying same widget cannot be installed twice');
            cy.contains('Install new widget').click();
            submitInvalidWidget('', 'Widget testWidget is already installed');
            cy.contains('Cancel').click();

            cy.log('Verifying widget can be removed');
            cy.contains('Remove').click();
            cy.contains('Yes').click();
            cy.contains('Test widget').should('not.exist');
        });

        it('install and use a widget', () => {
            submitWidget();

            cy.log('Verifying widget can be added to the page');
            cy.get('*[data-id=testWidget]').click();
            cy.contains('Add selected widgets').click();
            cy.get('.testWidgetWidget');

            cy.log('Verifying used widget can be uninstalled');
            cy.get('.editModeButton:contains(Add Widget):eq(1)').click();
            cy.contains('Remove').click();
            cy.contains('Yes').click();
            cy.contains('Test widget').should('not.exist');
            cy.get('.testWidgetWidget').should('not.exist');
        });
    });
});
