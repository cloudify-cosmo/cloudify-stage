import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';
import generateUploadFormData from 'app/widgets/common/blueprints/generateUploadFormData';
import type { BlueprintUploadParameters } from '../../../app/widgets/common/blueprints/BlueprintActions';
import type { Visibility } from '../../../app/widgets/common/types';

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

const uploadBlueprint = (blueprintId: string, parameters: BlueprintUploadParameters, timeout?: number) => {
    const formData = generateUploadFormData(parameters);
    return cy.doXhrPutRequest(`/blueprints/${blueprintId}`, formData, timeout);
};

const uploadBlueprintWithFile = (
    filePath: string,
    blueprintId: string,
    parameters: BlueprintUploadParameters,
    timeout?: number
) => {
    return cy
        .fixture(filePath, 'binary')
        .then(binary => Cypress.Blob.binaryStringToBlob(binary))
        .then(fileContent => {
            const formData = generateUploadFormData(parameters, fileContent);

            return cy.doXhrPutRequest(`/blueprints/${blueprintId}`, formData, timeout);
        });
};

const commands = {
    uploadBlueprint: (
        pathOrUrl: string,
        id: string,
        { yamlFile = 'blueprint.yaml', visibility = 'tenant', timeout }: UploadBlueprintOptions = {}
    ): Cypress.Chainable<unknown> => {
        const requestParameters: BlueprintUploadParameters = {
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
