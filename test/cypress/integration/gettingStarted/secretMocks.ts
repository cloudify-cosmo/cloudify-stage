export const mockSecretsManager = (items: any[]) =>
    cy.interceptSp('GET', /^\/secrets\?.*\b_include=(\bkey\b|\bvisibility\b|,)+/, {
        body: { metadata: { pagination: { total: items.length, size: 1000, offset: 0 }, filtered: null }, items }
    });

export const mockEmptySecretsManager = () => mockSecretsManager([]);

export const mockAwsSecretsManager = () =>
    mockSecretsManager([
        { key: 'aws_access_key_id', visibility: 'tenant' },
        { key: 'aws_secret_access_key', visibility: 'tenant' }
    ]);

export const mockSecretCreation = (secretName: string) => cy.interceptSp('PUT', `/secrets/${secretName}`, { body: {} });

export const mockSecretUpdate = (secretName: string) => cy.interceptSp('PATCH', `/secrets/${secretName}`, { body: {} });
