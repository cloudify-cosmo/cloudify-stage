export const mockEmptySecretsManager = () =>
    cy.interceptSp('GET', '/secrets?_include=key,visibility', {
        body: { metadata: { pagination: { total: 0, size: 1000, offset: 0 }, filtered: null }, items: [] }
    });

export const mockAwsSecretsManager = () =>
    cy.interceptSp('GET', '/secrets?_include=key,visibility', {
        body: {
            metadata: { pagination: { total: 2, size: 1000, offset: 0 }, filtered: null },
            items: [
                { key: 'aws_access_key_id', visibility: 'tenant' },
                { key: 'aws_secret_access_key', visibility: 'tenant' }
            ]
        }
    });

export const mockSecretCreation = (secretName: string) => cy.interceptSp('PUT', `/secrets/${secretName}`, { body: {} });

export const mockSecretUpdate = (secretName: string) => cy.interceptSp('PATCH', `/secrets/${secretName}`, { body: {} });
