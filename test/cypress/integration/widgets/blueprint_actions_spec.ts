import path from 'path';
import type { BlueprintActionButtonsConfiguration } from '../../../../widgets/blueprintActionButtons/src/widget';

describe('Blueprint Action Buttons widget', () => {
    const blueprintName = 'blueprints_actions_test';

    before(() =>
        cy
            .activate('valid_trial_license')
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName)
    );

    const useBlueprintActionButtonsWidget = (widgetConfig: Partial<BlueprintActionButtonsConfiguration> = {}) => {
        cy.usePageMock('blueprintActionButtons', widgetConfig).mockLogin().setBlueprintContext(blueprintName);
    };

    const getEditACopyInComposerButton = () => cy.contains('Edit a copy in Composer');

    it('should not show the "Edit a copy in Composer" button by default', () => {
        useBlueprintActionButtonsWidget();

        getEditACopyInComposerButton().should('not.exist');
    });

    it('should open Composer with imported blueprint on "Edit a copy in Composer" button click', () => {
        useBlueprintActionButtonsWidget({ showEditCopyInComposerButton: true });

        getEditACopyInComposerButton().click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${blueprintName}/blueprint.yaml`);
    });

    it.only('should download the blueprint', () => {
        const downloadedFileName = `${blueprintName}.zip`;
        useBlueprintActionButtonsWidget();

        cy.contains('Download blueprint').click();
        cy.verifyDownloadedFileExistence(downloadedFileName);
    });

    it('should open deployment modal', () => {
        useBlueprintActionButtonsWidget();
        cy.get('button#createDeploymentButton').click();

        cy.get('div.deployBlueprintModal').should('be.visible');
        cy.get('.actions > .ui:nth-child(1)').should('have.text', 'Cancel');
        cy.get('.actions > .ui:nth-child(2)').within(() => {
            cy.get('button').should('have.text', 'Install');
            cy.contains('.dropdown', 'Install')
                .click() // open dropdown
                .within(() => {
                    cy.get('.item:nth-child(1)').should('have.text', 'Deploy');
                    cy.get('.item:nth-child(2)').should('have.text', 'Install');
                })
                .click(); // close dropdown
        });

        cy.get('.actions > .ui:nth-child(1)').click();
        cy.get('div.deployBlueprintModal').should('not.exist');
    });
});
