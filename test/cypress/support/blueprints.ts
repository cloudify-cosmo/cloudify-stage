import type { GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { addCommands } from 'cloudify-ui-common/cypress/support';
import type { Visibility } from '../../../widgets/common/src/types';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

interface UploadBlueprintOptions {
    yamlFile?: string;
    visibility?: Visibility;
    timeout?: number;
}

interface BlueprintParameters {
    /* eslint-disable camelcase */
    application_file_name: string;
    blueprint_archive_url?: string;
    visibility?: string;
    async_upload?: boolean;
    /* eslint-enable camelcase */
}

const uploadBlueprint = (blueprintId: string, parameters: BlueprintParameters, timeout?: number) => {
    const formData = new FormData();
    formData.append('params', JSON.stringify(parameters));
    return cy.doXhrPutRequest(`/blueprints/${blueprintId}`, formData, timeout);
};

const uploadBlueprintWithFile = (
    filePath: string,
    blueprintId: string,
    parameters: BlueprintParameters,
    timeout?: number
) => {
    return cy
        .fixture(filePath, 'binary')
        .then(binary => Cypress.Blob.binaryStringToBlob(binary))
        .then(fileContent => {
            const formData = new FormData();
            formData.append('blueprint_archive', fileContent);
            formData.append('params', JSON.stringify(parameters));

            return cy.doXhrPutRequest(`/blueprints/${blueprintId}`, formData, timeout);
        });
};

const commands = {
    uploadBlueprint: (
        pathOrUrl: string,
        id: string,
        { yamlFile = 'blueprint.yaml', visibility = 'tenant', timeout }: UploadBlueprintOptions = {}
    ): Cypress.Chainable<unknown> => {
        const requestParameters: BlueprintParameters = {
            visibility,
            application_file_name: yamlFile
        };

        if (pathOrUrl.startsWith('http')) {
            return uploadBlueprint(
                id,
                {
                    ...requestParameters,
                    blueprint_archive_url: pathOrUrl
                },
                timeout
            );
        }

        return uploadBlueprintWithFile(pathOrUrl, id, requestParameters, timeout);
    },
    getBlueprint: (blueprintId: string) => cy.cfyRequest(`/blueprints?id=${blueprintId}`, 'GET'),
    deleteBlueprint: (blueprintId: string, force = false) =>
        cy
            .cfyRequest(`/deployments?blueprint_id=${blueprintId}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteDeployment(id, force)))
            .then(() => cy.waitUntilEmpty(`deployments?blueprint_id=${blueprintId}`))
            .then(() =>
                cy.cfyRequest(`/blueprints/${blueprintId}?force=${force}`, 'DELETE', null, null, {
                    failOnStatusCode: false
                })
            ),
    deleteBlueprints: (search: string, force = false) =>
        cy
            .cfyRequest(`/blueprints?_search=${search}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.deleteBlueprint(id, force)))
            .then(() => cy.waitUntilEmpty('blueprints', { search }))
};

addCommands(commands);
