describe('Number of Deployments widget', () => {
    const widgetId = 'deploymentNum';
    const resourcePrefix = `${widgetId}_test_`;
    const testBlueprintId = `${resourcePrefix}bp`;
    const serviceDeploymentId1 = `${resourcePrefix}_service_1`;
    const serviceDeploymentId2 = `${resourcePrefix}_service_2`;
    const environmentDeploymentId = `${resourcePrefix}_environment`;

    before(() => {
        cy.activate()
            .usePageMock(widgetId)
            .killRunningExecutions()
            .deleteDeployments('', true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint('blueprints/simple.zip', testBlueprintId)
            .deployBlueprint(testBlueprintId, serviceDeploymentId1)
            .deployBlueprint(testBlueprintId, serviceDeploymentId2)
            .deployBlueprint(testBlueprintId, environmentDeploymentId)
            .setLabels(environmentDeploymentId, [{ 'csys-obj-type': 'environment' }])
            .mockLogin();
    });

    beforeEach(() => {});

    /*
        TODO: Add tests

        should display correct number of deployments
          without filtering
          with filtering

        should provide configuration of
          label
          icon
          image
          filter ID

            cy.editWidgetConfiguration(widgetId, () => {

            });

        should open selected page on click when filtering is
          on
          off

        (optional) should open default page on click when filtering is
          on
          off
     */
});
